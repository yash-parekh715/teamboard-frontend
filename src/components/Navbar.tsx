import { motion } from "framer-motion";
import Button from "../components/UI/Buttons";
import { useState, useEffect } from "react";
import Logo from "./UI/Logo";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onSignupClick }) => {
  const [scrollY, setScrollY] = useState(0);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStartAnnotating = () => {
    navigate("/dashboard");
  };

  const handleLogout = async () => {
    try {
      await logout(); // Clear user state in context
      // window.location.href = "/"; // Force a full page reload
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.97 },
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`fixed w-full z-50 transform-gpu ${
        scrollY > 50
          ? "backdrop-blur-sm bg-pale-50/25 border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />

          <div className="flex items-center space-x-2 sm:space-x-3">
            {user ? (
              // Authenticated user buttons
              <>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    className="text-sm sm:text-base bg-transparent text-gray-700 hover:bg-transparent shadow-sm hover:shadow-lg border border-purple-500 hover:shadow-purple-500/25 px-2 py-1 rounded-lg font-normal transition-all transform-gpu"
                    onClick={handleStartAnnotating}
                  >
                    Start Annotating
                  </Button>
                </motion.div>

                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    className="px-3 py-2 rounded-lg font-medium transition-all bg-purple-600 border border-red-500 text-white shadow-lg hover:shadow-red-400/50 text-sm sm:text-base transform-gpu"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </motion.div>
              </>
            ) : (
              // Unauthenticated user buttons
              <>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    className="text-sm sm:text-base bg-transparent text-gray-700 hover:bg-transparent shadow-sm hover:shadow-lg border border-purple-500 hover:shadow-purple-500/25 px-2 py-1 rounded-lg font-normal transition-all transform-gpu"
                    onClick={onLoginClick}
                  >
                    Login
                  </Button>
                </motion.div>

                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    className="px-3 py-2 rounded-lg font-medium transition-all bg-purple-600 text-white shadow-lg hover:shadow-purple-500/50 text-sm sm:text-base transform-gpu"
                    onClick={onSignupClick}
                  >
                    SignUp
                  </Button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500/0 via-purple-500 to-purple-500/0 transform-gpu"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6 }}
      />
    </motion.nav>
  );
};

export default Navbar;
