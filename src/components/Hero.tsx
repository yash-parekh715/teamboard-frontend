import { motion } from "framer-motion";
import Button from "../components/UI/Buttons";
import Icons from "../components/UI/Icons";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface HeroProps {
  onGetStartedClick: () => void;
}

const FloatingElement = ({
  children,
  delay,
  duration = 3,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  duration?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{
      y: [-10, 10, -10],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const Hero: React.FC<HeroProps> = ({ onGetStartedClick }) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Add effect to properly set authentication status after loading
  useEffect(() => {
    if (!loading) {
      setIsAuthenticated(!!user);
      console.log("Auth status updated:", !!user);
    }
  }, [user, loading]);

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Get started clicked, auth status:", isAuthenticated);

    if (isAuthenticated) {
      // User is authenticated, navigate to dashboard
      navigate("/dashboard");
    } else {
      // User is not authenticated, open signup modal
      onGetStartedClick();
    }
  };

  return (
    <section className="pt-20 sm:pt-36 md:pt-32 pb-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/40 bg-[size:20px_20px] z-0" />

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-pale-50 via-purple-200/35 to-pale-50/50 z-0" />

      {/* Floating Elements - Hidden on smallest screens */}
      <div className="absolute inset-0 overflow-hidden hidden sm:block">
        <FloatingElement delay={0} className="hidden lg:block">
          <motion.div
            className="absolute top-28 left-[5%] p-3 bg-white rounded-lg shadow-lg"
            whileHover={{ scale: 1.1 }}
          >
            <Icons.Collaborators className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
          </motion.div>
        </FloatingElement>

        <FloatingElement delay={0.5} className="hidden md:block">
          <motion.div
            className="absolute top-40 right-[5%] p-3 bg-white rounded-lg shadow-lg"
            whileHover={{ scale: 1.1 }}
          >
            <Icons.Draw className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
          </motion.div>
        </FloatingElement>

        <FloatingElement delay={1} className="hidden md:block">
          <motion.div
            className="absolute bottom-20 left-[10%] p-3 bg-white rounded-lg shadow-lg"
            whileHover={{ scale: 1.1 }}
          >
            <Icons.Note className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
          </motion.div>
        </FloatingElement>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-[90%] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
              <span className="bg-purple-600 bg-clip-text text-transparent">
                Collaborate
              </span>{" "}
              on a Shared{" "}
              <span className="bg-purple-600 bg-clip-text text-transparent">
                Whiteboard
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-10 px-4 sm:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Create, share, and collaborate in real-time. Bring your team's ideas
            to life with our interactive whiteboard platform.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              className="px-5 py-3 rounded-lg font-medium transition-all bg-purple-600 text-white shadow-lg hover:shadow-purple-500/50 group w-auto"
              onClick={handleGetStarted}
            >
              <span className="relative z-10">
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
              </span>
              <motion.span
                className="absolute inset-0 bg-purple-700 rounded-lg"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            </Button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="mt-10 grid grid-cols-2  md:grid-cols-3 sm:grid-cols-3 gap-4 sm:gap-8 px-4 sm:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-purple-600">
                10k+
              </h3>
              <p className="text-sm sm:text-base text-gray-600">Active Teams</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-purple-600">
                1M+
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Whiteboards Created
              </p>
            </div>
            <div className="text-center hidden md:block">
              <h3 className="text-2xl sm:text-3xl font-bold text-purple-600">
                99.9%
              </h3>
              <p className="text-sm sm:text-base text-gray-600">Uptime</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
