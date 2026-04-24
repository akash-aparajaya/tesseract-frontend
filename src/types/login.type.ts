// ✅ Types
type FormState = {
  email: string;
  password: string;
};

type Errors = {
  email?: string;
  password?: string;
};

type Toast = {
  show: boolean;
  message: string;
  type: "success" | "error" | "";
};

export type { FormState, Errors, Toast };