function formatTimestamp(isoString, mode = "all") {
  const date = new Date(isoString);
  const timeZone = "Asia/Dubai";

  const pad = (num) => String(num).padStart(2, "0");

  const year = date.toLocaleString("en-US", { year: "numeric", timeZone });
  const month = pad(date.toLocaleString("en-US", { month: "2-digit", timeZone }));
  const day = pad(date.toLocaleString("en-US", { day: "2-digit", timeZone }));
  const hour = pad(date.toLocaleString("en-US", { hour: "2-digit", hour12: false, timeZone }));
  const minute = pad(date.toLocaleString("en-US", { minute: "2-digit", timeZone }));
  const second = pad(date.toLocaleString("en-US", { second: "2-digit", timeZone }));

  switch (mode) {
    case "dateonly":
      return `${day}-${month}-${year}`;
    case "dd-mm-yyyy":
      return `${day}-${month}-${year}`;
    case "all":
    default:
      return `${day}-${month}-${year}, ${hour}:${minute}:${second}`;
  }
}

export default formatTimestamp;
