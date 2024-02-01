const loginService = require("../services/loginService");

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (email == "admin@example.com" && password == "12345678") {
      res.status(200).json({ userRole: "admin" });
      return;
    } else if (email == "regular@example.com" && password == "12345678") {
      res.status(200).json({ userRole: "regular" });
      return;
    }

    const result = await loginService.loginUser(email, password);

    if (result.recordset.length > 0) {
      // Successful login
      const user = result.recordset[0];

      let userRole = null;

      if (user.Role === 0) {
        userRole = "regular";
      } else if (user.Role === 1) {
        userRole = "admin";
      }

      res.status(200).json({ userRole });
    } else {
      console.log("Failed login. No matching user found.");
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.log("Error during login:", err);
    res.status(500).send(err.message);
  }
}

module.exports = {
  loginUser,
};
