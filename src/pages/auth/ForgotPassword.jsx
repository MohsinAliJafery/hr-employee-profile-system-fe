import { useState } from "react";
import authAPI from '../../services/auth';
import { toast } from "sonner";
import { ArrowLeft, Mail, CheckCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      toast.error("Please enter your email address");
      setIsLoading(false);
      return;
    }

    try {
      console.log("=== FORGOT PASSWORD REQUEST ===");
      console.log("Email:", email);
      
      const response = await authAPI.forgotPassword(email);

      console.log("=== FORGOT PASSWORD RESPONSE ===");
      console.log("Full response:", response);
      console.log("Success:", response.success);
      console.log("Message:", response.message);

      if (response.success) {
        toast.success(response.message || "Password reset email sent!");
        setEmailSent(true);
      } else {
        toast.error(response.message || "Failed to send reset email");
      }
    } catch (error) {
      console.error("=== FORGOT PASSWORD ERROR ===");
      console.log("Error:", error);
      console.log("Error response:", error.response?.data);
      
      const message = error.response?.data?.message || "Failed to send reset email. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAnotherEmail = () => {
    setEmailSent(false);
    setEmail("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] px-6 py-4 text-white">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-2"
            disabled={isLoading}
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Login</span>
          </button>
          <h2 className="text-xl font-bold">
            {emailSent ? "Check Your Email" : "Reset Your Password"}
          </h2>
        </div>

        <div className="p-6">
          {!emailSent ? (
            <>
              {/* Before Email Sent */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Mail className="text-[#8C00FF]" size={32} />
                  </div>
                </div>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent"
                    disabled={isLoading}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full p-3 bg-gradient-to-r from-[#8C00FF] to-[#FF3F7F] text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* After Email Sent */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="text-green-600" size={32} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Check Your Email!
                </h3>
                <p className="text-gray-600 mb-4">
                  We've sent a password reset link to:
                </p>
                <p className="text-[#8C00FF] font-medium bg-purple-50 px-3 py-2 rounded-lg">
                  {email}
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">
                    What to do next:
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Check your inbox for an email from us</li>
                    <li>• Click the reset link in the email</li>
                    <li>• Follow the instructions to set a new password</li>
                    <li>• Check your spam folder if you don't see it</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> The reset link will expire in 1 hour for security reasons.
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={handleTryAnotherEmail}
                    className="flex items-center justify-center gap-2 p-3 border border-[#8C00FF] text-[#8C00FF] rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                    disabled={isLoading}
                  >
                    <Mail size={16} />
                    Try Another Email
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="p-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    disabled={isLoading}
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@company.com" className="text-[#8C00FF] hover:underline">
              support@company.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;