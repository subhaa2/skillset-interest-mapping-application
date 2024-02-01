// dd/mm/yy E.g 01/01/24
export function formatDateToDDMMYY(isoTime) {
  const date = new Date(isoTime);

  return date.toLocaleString("en-SG", {
    timeZone: "Asia/Singapore",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
}

// dd mmm yy E.g 01 Jan 24
export function formatDateToShortNumeric(isoTime) {
  // Create a new Date object using the ISO time
  const date = new Date(isoTime);

  // Convert to Singapore time using toLocaleString
  return date.toLocaleString("en-SG", {
    timeZone: "Asia/Singapore",
    year: "2-digit",
    month: "short",
    day: "2-digit",
  });
}
