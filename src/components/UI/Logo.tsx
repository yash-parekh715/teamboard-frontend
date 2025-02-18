import { motion } from "framer-motion";

const Logo = () => {
  return (
    <motion.div
      whileHover={{ rotate: 5, scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <span className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent cursor-pointer">
        TeamBoard
      </span>
    </motion.div>
  );
};
export default Logo;
