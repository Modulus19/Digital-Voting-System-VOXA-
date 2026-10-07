export function getTimeRemaining(closesAt, status) {
  if (status === "closed") {
    return "Closed";
  }

  const difference =
    new Date(closesAt).getTime() - Date.now();

  if (difference <= 0) {
    return "Closed";
  }

  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (days >= 1) {
    return `Ends in ${days} ${days === 1 ? "day" : "days"}`;
  }

  if (hours >= 1) {
    return `Ends in ${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  return `Ends in ${Math.max(minutes, 1)} ${
    minutes === 1 ? "minute" : "minutes"
  }`;
}