import api from "./api";

export const createProject = (data: {
  project_name: string;
  project_description: string;
  isActive: boolean;
}) => {
  return api.post("/project/create-project", data);
};

export const getProjects = () => {
  return api.get("/project/get-projects");
};
