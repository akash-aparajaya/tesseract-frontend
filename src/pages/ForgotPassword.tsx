import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/forgot.css";
import { resetPasswordApi } from "../services/authApi";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!password || !confirmPassword) {
      setMessageType("error");
      setMessage("⚠️ All fields are required");
      return;
    }

    if (password.length < 6) {
      setMessageType("error");
      setMessage("⚠️ Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setMessageType("error");
      setMessage("❌ Passwords do not match");
      return;
    }

    if (!token) {
      setMessageType("error");
      setMessage("❌ Invalid reset link");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await resetPasswordApi({ token, password });
      setMessageType("success");
      setMessage("✅ Password reset successful! Redirecting...");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setMessageType("error");
      setMessage(err?.response?.data?.message || "❌ Invalid or expired link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      {/* Toast / floating message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -60 }}
            className={`reset-toast ${messageType}`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="reset-card">
        <div className="reset-card-inner">
          <div className="reset-header">
            <h2>Create new password</h2>
            <p>Your new password must be different from previously used passwords</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>New Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button className="reset-btn" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>

            <div className="login-link">
              <button type="button" onClick={() => navigate("/")}>
                ← Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}