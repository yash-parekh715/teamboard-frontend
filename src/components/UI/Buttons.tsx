import { motion } from "framer-motion";

import { HTMLMotionProps } from "framer-motion";

type ButtonProps = {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
} & Omit<HTMLMotionProps<"button">, "ref">;

const Button = ({ variant = "primary", children, ...props }: ButtonProps) => {
  const variants = {
    primary: "bg-purple-600 text-white shadow-lg hover:shadow-purple-500/50",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm hover:shadow-xl border border-purple-500 hover:shadow-purple-500/50",
    outline: "border-2 border-purple-600 text-purple-600 hover:bg-purple-50",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-3 py-2 rounded-lg font-medium transition-all ${variants[variant]} ${props.className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
