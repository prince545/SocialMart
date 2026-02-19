require('dotenv').config();
const mongoose = require('mongoose');
const { checkModeration } = require('./controllers/aiController');
const Post = require('./models/Post');
const User = require('./models/User');

async function testController() {
    try {
        console.log("1. Testing checkModeration...");
        const modResult = checkModeration("This is a safe text");
        console.log("Safe text result:", modResult);
        const modBad = checkModeration("This contains spam");
        console.log("Bad text result:", modBad);

        if (modResult.flagged || !modBad.flagged) {
            console.error("❌ checkModeration logic seems wrong");
        } else {
            console.log("✅ checkModeration works");
        }

        console.log("\n2. Connecting to DB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB Connected");

        console.log("\n3. Testing Post Creation Logic (Simulated)...");
        const user = await User.findOne();
        if (!user) {
            console.log("❌ No user found to test with");
            return;
        }
        console.log("Found user:", user.name, user._id);

        // Simulate request body
        const reqMock = {
            user: { id: user._id.toString() },
            body: {
                text: "Test post text",
                caption: "Test caption",
                imageUrl: "https://example.com/image.jpg",
                products: "[]" // JSON string
            }
        };

        // Replicate controller logic
        const dbUser = await User.findById(reqMock.user.id).select('-password');
        if (!dbUser) {
            console.error("❌ createPost could not find user by ID");
        } else {
            console.log("✅ createPost found user:", dbUser.name);
        }

        const textToCheck = reqMock.body.text || "" + " " + reqMock.body.caption || "";
        console.log("Text to check:", textToCheck);

        const check = checkModeration(textToCheck);
        if (check.flagged) {
            console.log("Post would be flagged:", check.reason);
        } else {
            console.log("Post would be approved.");
        }

        console.log("✅ Logic verification complete. If this script runs, the 500 error is likely elsewhere or resolved.");

    } catch (error) {
        console.error("❌ Error during test:", error);
    } finally {
        await mongoose.disconnect();
    }
}

testController();
