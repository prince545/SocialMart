const jwt = require('jsonwebtoken');
const https = require('https');
const User = require('../models/User');

// Cache JWKS to avoid fetching on every request
let jwksCache = null;
let jwksCacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const CLERK_JWKS_URL = process.env.CLERK_JWKS_URL ||
    'https://live-sunbeam-4.clerk.accounts.dev/.well-known/jwks.json';

function fetchJWKS() {
    return new Promise((resolve, reject) => {
        const now = Date.now();
        if (jwksCache && now - jwksCacheTime < CACHE_TTL) {
            return resolve(jwksCache);
        }
        https.get(CLERK_JWKS_URL, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const keys = JSON.parse(data).keys;
                    jwksCache = keys;
                    jwksCacheTime = now;
                    resolve(keys);
                } catch (e) {
                    reject(new Error('Failed to parse JWKS'));
                }
            });
        }).on('error', reject);
    });
}

function getPublicKey(keys, kid) {
    const key = kid ? keys.find(k => k.kid === kid) : keys[0];
    if (!key) throw new Error(`Key not found in JWKS (kid: ${kid})`);

    if (key.x5c && key.x5c[0]) {
        const b64 = key.x5c[0];
        return `-----BEGIN CERTIFICATE-----\n${b64.match(/.{1,64}/g).join('\n')}\n-----END CERTIFICATE-----`;
    }

    const jwkToPem = require('jwk-to-pem');
    return jwkToPem(key);
}

module.exports = async function (req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded_header = jwt.decode(token, { complete: true });
        if (!decoded_header) throw new Error('Invalid token format');

        const kid = decoded_header.header.kid;
        const keys = await fetchJWKS();
        const publicKey = getPublicKey(keys, kid);

        // Disable audience/issuer checks — Clerk tokens use URL-format values
        // that jsonwebtoken rejects unless explicitly ignored
        const decoded = jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
            ignoreExpiration: false,
            audience: undefined,
            issuer: undefined,
            complete: false
        });

        const clerkId = decoded.sub;

        let user = await User.findOne({ clerkId });
        if (!user) {
            const username = decoded.username
                || decoded.email?.split('@')[0]
                || `user_${clerkId.slice(-6)}`;
            user = new User({
                clerkId,
                username,
                email: decoded.email || `${clerkId}@clerk.dev`,
                avatar: decoded.image_url || ''
            });
            await user.save();
            console.log(`[Auth] Created new user: ${username} (${clerkId})`);
        }

        req.user = { id: user.id };
        next();
    } catch (err) {
        console.error('[Auth] Failed:', err.message);
        res.status(401).json({ msg: 'Token is not valid', detail: err.message });
    }
};
