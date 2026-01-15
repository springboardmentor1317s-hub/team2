const { OAuthApp } = require("@octokit/oauth-app");

// Create a new OAuth 2.0 client
const githubClient = new OAuthApp({
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  clientType: "oauth-app",
});

githubClient.getUserDetails = async function (code) {
  // Get user details
  const { authentication } = await this.createToken({ code });
  const token = authentication.token;
  // Get user email
  const userRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `token ${token}` },
  });
  const user = await userRes.json();
  let email = user.email;
  // If email is not available, try to get it from the emails
  if (!email) {
    const emailRes = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `token ${token}` },
    });
    const emails = await emailRes.json();
    email = emails.find((e) => e.primary && e.verified)?.email || null;
  }
  // Return user details
  return {
    name: user.name || user.login,
    picture: user.avatar_url,
    email,
  };
};





module.exports = { githubClient };
