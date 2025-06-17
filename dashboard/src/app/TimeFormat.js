function formatTimestamp(isoString, mode = "all") {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid-Date";

  const pad = (num) => String(num).padStart(2, "0");

  const year = date.toLocaleString("en-US", { year: "numeric" });
  const month = pad(date.toLocaleString("en-US", { month: "2-digit" }));
  const day = pad(date.toLocaleString("en-US", { day: "2-digit" }));

  const timeParts = date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).split(" ");

  const [hourMinute, period] = timeParts;
  const [hour, minute] = hourMinute.split(":").map(pad);

  switch (mode) {
    case "dateonly":
    case "dd-mm-yyyy":
      return `${day}-${month}-${year}`;
    case "all":
    default:
      return `${day}-${month}-${year}, ${hour}:${minute} ${period}`;
  }
}

export default formatTimestamp;
