import api from "./api";

// login API
export const loginUser = (data: {
  email: string;
  password: string;
}) => {
  return api.post("/auth/login", data);
};

// logout API
export const logoutUser = () => {
  return api.post("/auth/logout");
};

//forgot password API
export const forgotPasswordApi = (data: { email: string }) => {
  return api.post("/auth/forgotPassword", data);
};

// reset password API
export const resetPasswordApi = (data: { token: string; password: string }) => {
  return api.post("/auth/resetPassword", data);
};

//get user API
export const getUserApi = () => {
  return api.get("/users/get-users");
};