// src/components/Features.tsx
import { motion } from "framer-motion";
import Icons from "./UI/Icons";
import FeatureCard from "./FeatureCard";

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
    icon: <Icons.Lock className="w-8 h-8 text-blue-600" />,
    title: "Secure",
    description:
      "Built by following best and standard security practices along with robust user authentication",
    highlightColor: "from-blue-500/20 to-blue-600/5",
    delay: 0.2,
  },
];

const Features = () => {
  return (
    <section className="pb-20 pt-10 relative overflow-hidden bg-gradient-to-b ">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-pale-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-pale-50 via-purple-200/35 to-pale-50/50" />

      {/* Decorative grid */}
      <div className="absolute inset-0 bg-grid-slate-200/40 bg-[size:20px_20px]" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-6  bg-purple-600 to-pink-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need to collaborate effectively with your team, all
            in one place.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-100 rounded-full filter blur-3xl opacity-30" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-100 rounded-full filter blur-3xl opacity-30" />
      </div>
    </section>
  );
};

export default Features;
