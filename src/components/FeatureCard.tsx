import { motion } from "framer-motion";
import Icons from "../components/UI/Icons";

const features = [
  {
    icon: <Icons.Draw className="w-8 h-8 text-purple-600" />,
    title: "Real-time Collaboration",
    description:
      "Draw, edit, and brainstorm together with your team in real-time. See changes instantly as they happen.",
    highlightColor: "from-purple-500/20 to-purple-600/5",
    delay: 0,
  },
  {
    icon: <Icons.Note className="w-8 h-8 text-pink-600" />,
    title: "Smart Tools & Shapes",
    description:
      "Access a wide range of drawing tools, sticky notes, and smart shapes to bring your ideas to life.",
    highlightColor: "from-pink-500/20 to-pink-600/5",
    delay: 0.1,
  },
  {
    icon: <Icons.Image className="w-8 h-8 text-blue-600" />,
    title: "Rich Media Support",
    description:
      "Easily add images, documents, and links to your whiteboard. Import and export in multiple formats.",
    highlightColor: "from-blue-500/20 to-blue-600/5",
    delay: 0.2,
  },
];

const FeatureCard = ({
  feature,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: feature.delay,
        ease: "easeOut",
      }}
      whileHover={{ y: -5 }}
      className="relative group bg-pale-50/50"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${feature.highlightColor} rounded-2xl transform transition-transform group-hover:scale-105`}
      />

      <div className="relative bg-white/95 p-8 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-100">
        {/* Icon with animated background */}
        <div className="relative mb-6 inline-block">
          <motion.div
            className="absolute inset-0 bg-current opacity-5 rounded-full"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3 }}
          />
          <div className="relative z-10 p-3">{feature.icon}</div>
        </div>

        {/* Title with gradient */}
        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">{feature.description}</p>

        {/* Subtle decoration elements */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.div
            className="w-12 h-12 rounded-full border-2 border-dashed border-purple-200"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
