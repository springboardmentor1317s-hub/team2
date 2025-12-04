const bcrypt = require("bcrypt");

// The password you want to hash
const password = "admin1234";

// Hash the password
bcrypt.hash(password, 10).then(hash => {
  console.log("Hashed Password:", hash);
  process.exit(); // exit Node after printing
});
