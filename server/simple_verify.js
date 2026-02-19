require('dotenv').config();
const { checkModeration } = require('./controllers/aiController');

console.log("Loaded aiController");
try {
    const result = checkModeration("test");
    console.log("Result:", result);
} catch (e) {
    console.error("Error executing checkModeration:", e);
}
