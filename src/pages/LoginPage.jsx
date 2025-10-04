import { useState } from "react";
import { motion } from "framer-motion";
import Logo from "../Components/Logo";
import { login } from "../Utils/apiUtils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";
import { saveUser } from "../Utils/auth";

export default function LoginForm() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(null);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Logging you in...", { id: "login" });

    try {
      const res = await login(formData.username, formData.password);

      if (res?.token) {
        // Save token to localStorage
        localStorage.setItem("token", res.token);
        saveUser(res.user);

        // Success notification
        toast.success("Login successful!", { id: "login" });

        // Redirect to main page after slight delay for smoothness
        setTimeout(() => navigate("/"), 500);
      } else {
        throw new Error(res);
      }
    } catch (error) {
      if (import.meta.env.VITE_MODE === "development") {
        console.error("Login failed:", error);
      }
      toast.error(error.message || "Login failed. Try again.", { id: "login" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8"
      >
        {/* Logo Section */}
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="xl:scale-[.95] mb-4"
          >
            <Logo color="black" />
          </motion.div>
        </motion.div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              className="mt-1 block w-full px-4 py-2 border-[.5px] border-gray-500 rounded-[8px] text-black focus:ring-1 focus:ring-black focus:outline-none"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative w-full">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                type={isHidden ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-2 border-[.5px] border-gray-500 rounded-[8px] text-black focus:ring-1 focus:ring-black focus:outline-none"
                disabled={loading}
              />

              {/* Eye icon button */}
              <button
                type="button"
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-600"
                onClick={() => setIsHidden((prev) => !prev)}
              >
                {isHidden ? <Eye /> : <EyeClosed />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-[8px] transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-900 text-white"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
