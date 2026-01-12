const { OAuth2Client } = require("google-auth-library");

// Create a new OAuth 2.0 client
const client = new OAuth2Client();
async function verifyGoogleCode(code) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: code,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.log("Failed to verify Google code: " + error);
  }
}

module.exports = { verifyGoogleCode };
