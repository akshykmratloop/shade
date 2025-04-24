function formatTimestamp(isoString) {
  const date = new Date(isoString);

  const options = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Dubai",
  };

  return date.toLocaleString("en-US", options);
}

export default formatTimestamp;
