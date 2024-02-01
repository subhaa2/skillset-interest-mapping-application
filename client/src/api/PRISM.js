export async function fetchPRISM() {
  const response = await fetch("http://localhost:5000/api/teacher/prism");

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const resData = await response.json();

  return resData;
}

export async function postPRISM({
  slots,
  type,
  title,
  teacher,
  specialisation,
  company,
  startDate,
  endDate,
  description,
}) {
  const response = await fetch("http://localhost:5000/api/teacher/prism", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      slots,
      type,
      title,
      teacher,
      specialisation,
      company,
      startDate,
      endDate,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const resData = await response.json();

  return resData;
}

export async function updatePRISM({
  id,
  slots,
  type,
  title,
  teacher,
  specialisation,
  company,
  startDate,
  endDate,
  description,
}) {
  const response = await fetch(
    `http://localhost:5000/api/teacher/prism/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slots,
        type,
        title,
        teacher,
        specialisation,
        company,
        startDate,
        endDate,
        description,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const resData = await response.json();

  return resData;
}

export async function deletePRISM(id) {
  const response = await fetch(
    `http://localhost:5000/api/teacher/prism/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const resData = await response.json();

  return resData;
}
export async function fetchPRISMSummary() {
  const response = await fetch(
    "http://localhost:5000/api/teacher/AllPRISMSummary",
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const resData = await response.json();

  return resData;
}
export async function updateITPSummary({ StudentID, id }) {
  const response = await fetch(
    `http://localhost:5000/api/teacher/${id}/EditAssign`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        StudentID,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const resData = await response.json();

  return resData;
}
