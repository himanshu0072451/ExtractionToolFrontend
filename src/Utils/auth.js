// Save token
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// Get token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Remove token
export const removeToken = () => {
  localStorage.removeItem("token");
  removeUser();
};

// Check if token exists
export const isAuthenticated = () => {
  return !!getToken();
};

// -------------------- User Info --------------------

// Save user object (e.g., after login)
export const saveUser = (user) => {
  // user = { username, role, allowedReaders }
  localStorage.setItem("user", JSON.stringify(user));
};

// Get user object
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Remove user
export const removeUser = () => {
  localStorage.removeItem("user");
};
