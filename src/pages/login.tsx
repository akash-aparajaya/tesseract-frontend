import { useState, FormEvent } from "react";
import { useNavigate,  } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import "../styles/login.css";
import logo from "../assets/logo.svg";
import { loginUser } from "../services/authApi";
import { FormState, Errors, Toast } from "../types/login.type";

// --- STEP 1: Define the Props Interface ---
interface LoginProps {
  setActivePage: (page: string) => void;
}

// --- STEP 2: Apply the Interface to the Component ---
export default function Login({ setActivePage }: LoginProps) {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [toast, setToast] = useState<Toast>({
    show: false,
    message: "",
    type: "",
  });

  const navigate = useNavigate();

  const showToast = (message: string, type: Toast["type"] = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const validate = (): Errors => {
    const newErrors: Errors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
    console.error(errors)
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await loginUser(form);

      if (res?.data?.success) {
        const { accessToken, refreshToken } = res.data.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        showToast("Login successful 🎉", "success");

        // --- STEP 3: Navigate via State and Route ---
        setTimeout(() => {
          setActivePage("dashboard"); // Updates Layout state
          navigate("/dashboard");     // Updates Browser URL
        }, 1500);
      } else {
        showToast(res?.data?.message || "Login failed", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Login failed. Try again!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -60 }}
            className={`toast-popup ${toast.type}`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="login-card">
        <div className="login-visual">
          <div className="brand">
            <img src={logo} alt="Logo" className="main-logo" />
          </div>
          <div className="overlay-content">
            <h1>Accounting Made Global.</h1>
            <p>Simplify sales and manage finances in one platform.</p>
          </div>
        </div>

        <motion.div className="login-form-side">
          <div className="login-form-inner">
            <header>
              <h2>Welcome back</h2>
              <p>Sign in to your account</p>
            </header>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}