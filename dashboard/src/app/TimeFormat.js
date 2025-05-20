function formatTimestamp(isoString, mode = "all") {
  const date = new Date(isoString);
  const timeZone = "Asia/Dubai";

  const pad = (num) => String(num).padStart(2, "0");

  const year = date.toLocaleString("en-US", { year: "numeric", timeZone });
  const month = pad(date.toLocaleString("en-US", { month: "2-digit", timeZone }));
  const day = pad(date.toLocaleString("en-US", { day: "2-digit", timeZone }));

  const timeParts = date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone
  }).split(" ");

  const [hourMinute, period] = timeParts;
  const [hour, minute] = hourMinute.split(":").map(pad);

  switch (mode) {
    case "dateonly":
      return `${day}-${month}-${year}`;
    case "dd-mm-yyyy":
      return `${day}-${month}-${year}`;
    case "all":
    default:
      return `${day}-${month}-${year}, ${hour}:${minute} ${period}`;
  }
}

export default formatTimestamp;

