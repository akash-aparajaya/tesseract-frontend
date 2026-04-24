import { useState, useCallback } from "react";

export const useToast = () => {
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const showToast = useCallback((message: string, type: "success" | "error" = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  return { toast, showToast };
};