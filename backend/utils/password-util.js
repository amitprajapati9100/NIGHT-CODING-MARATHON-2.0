export const PASSWORD_RULE =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";

export const isStrongPassword = (password = "") =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
