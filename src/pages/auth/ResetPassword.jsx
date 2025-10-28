import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authAPI from '../../services/auth';
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";

const ResetPassword = ({ onBackToLogin }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!token) {
      toast.error("Invalid reset link");
      setIsLoading(false);
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      console.log("=== RESET PASSWORD REQUEST ===");
      console.log("Token:", token);
      
      const response = await authAPI.resetPassword(token, password);

      console.log("=== RESET PASSWORD RESPONSE ===");
      console.log("Full response:", response);
      console.log("Success:", response.success);
      console.log("Message:", response.message);

      if (response.success) {
        toast.success(response.message || "Password reset successfully!");
        setResetSuccess(true);
        
        // Auto redirect to login after 3 seconds
        setTimeout(() => {
          onBackToLogin();
        }, 3000);
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("=== RESET PASSWORD ERROR ===");
      console.log("Error:", error);
      console.log("Error response:", error.response?.data);
      
      const message = error.response?.data?.message || "Failed to reset password. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !resetSuccess) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-2/5 p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-4">This password reset link is invalid or has expired.</p>
            <button
              onClick={onBackToLogin}
              className="w-full p-3 bg-[#8C00FF] text-white rounded font-semibold hover:opacity-90"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-2/5 p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-green-600 mb-4">Password Reset Successfully!</h2>
            <p className="text-gray-600 mb-4">
              Your password has been reset successfully. Redirecting to login...
            </p>
            <button
              onClick={onBackToLogin}
              className="w-full p-3 bg-[#8C00FF] text-white rounded font-semibold hover:opacity-90"
            >
              Go to Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-2/5 p-6 bg-white rounded-lg shadow-lg">
        <button
          onClick={navigate(-1)}
          className="flex items-center gap-2 text-[#8C00FF] hover:text-[#450693] mb-4"
        >
          <ArrowLeft size={20} />
          Back to Login
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#450693]">Reset Your Password</h2>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8C00FF] pr-10"
              disabled={isLoading}
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8C00FF] pr-10"
              disabled={isLoading}
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              Password must be at least 6 characters long
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] text-white rounded font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;