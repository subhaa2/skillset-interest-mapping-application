export async function fetchStudent() {
  const response = await fetch(
    "http://localhost:5000/api/teacher/getAllStudents",
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const resData = await response.json();

  return resData;
}

export async function updateStudent({ StudentID, FullName, spec, gpa }) {
  const response = await fetch(
    `http://localhost:5000/api/teacher/updateStudent`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        StudentID,
        FullName,
        spec,
        gpa,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const resData = await response.json();

  return resData;
}
