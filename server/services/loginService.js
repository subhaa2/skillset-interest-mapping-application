const dbConfig = require("../config/dbConfig");
const bcrypt = require("bcrypt");

async function loginUser(email, password) {
  const connection = await dbConfig.connectDB();

  try {
    const userQuery = `SELECT * FROM Users WHERE Email = '${email}'`;
    const users = await connection.query(userQuery);

    if (users.length === 0) {
      throw new Error("User not found");
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.Password);

    if (!match) {
      throw new Error("Password is incorrect");
    }

    return user;
  } catch (error) {
    console.error("Error executing login query:", error);
    throw error;
  } finally {
    connection.close();
  }
}

module.exports = {
  loginUser,
};
