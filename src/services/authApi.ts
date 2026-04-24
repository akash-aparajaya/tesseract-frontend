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