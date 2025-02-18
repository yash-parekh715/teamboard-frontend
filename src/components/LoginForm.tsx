import React from "react";
import { motion } from "framer-motion";
import { GoogleIcon } from "../components/UI/Icons";
import LoginFormProps from "../components/Interfaces/LoginFormProps";

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      id="login"
    >
      <div className="space-y-4">
        <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors">
          <GoogleIcon className="text-xl" />
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-pale-50 text-gray-500">OR</span>
        </div>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Log in
        </button>
      </form>
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={onSwitchToSignup}
          className="text-purple-600 hover:text-purple-700 font-medium underline cursor-pointer"
        >
          Sign up
        </button>
      </p>
    </motion.div>
  );
};

export default LoginForm;
