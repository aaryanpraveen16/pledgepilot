export function getUserInTheSession() {
  const sessionUser = sessionStorage.getItem("user");
  if (!sessionUser || sessionUser === "undefined" || sessionUser.trim() === "") {
    return null;
  }
  try {
    return JSON.parse(sessionUser);
  } catch (error) {
    console.error("Failed to parse user from sessionStorage:", error);
    sessionStorage.removeItem("user");
    return null;
  }
}
