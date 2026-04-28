import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/login.css";
import logo from "../assets/logo.svg"; // adjust path if needed
import { loginUser } from "../services/authApi";
import { FormState, Errors, Toast } from "../types/login.type";

export default function Login() {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [forgotLoading, setForgotLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [toast, setToast] = useState<Toast>({ show: false, message: "", type: "" });
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [logoError, setLogoError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false); // 👈 new

  const navigate = useNavigate();

  const showToast = (message: string, type: Toast["type"] = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
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
        setTimeout(() => navigate("/dashboard"), 1000);
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

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) {
      showToast("Please enter your email address", "error");
      return;
    }
    setForgotLoading(true);
    try {
      // await forgotPassword(forgotEmail);
      showToast("Password reset link sent to your email!", "success");
      setShowForgotModal(false);
      setForgotEmail("");
    } catch {
      showToast("Failed to send reset link. Try again.", "error");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="login-page">
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
        <div className="login-card-inner">
          <div className="logo-area">
            {!logoError ? (
              <img
                src={logo}
                alt="Tesseract"
                className="login-logo"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="logo-fallback">🔷 TESSERACT</div>
            )}
          </div>
          <h2>Welcome back</h2>
          <p className="welcome-text">Sign in to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="extra-links">
              <button
                type="button"
                className="forgot-link"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot password?
              </button>
            </div>
          </form>
        </div>
      </div>

      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="forgot-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Reset Password</h3>
              <button className="close-btn" onClick={() => setShowForgotModal(false)}>×</button>
            </div>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowForgotModal(false)}>Cancel</button>
              <button className="btn-submit" onClick={handleForgotPassword} disabled={forgotLoading}>
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}