// api.js
export async function loginUserApi(email, password) {
  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Authentication failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("An error occurred during authentication");
  }
}
