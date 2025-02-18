import { motion } from "framer-motion";
import Icons from "../components/UI/Icons";
import Logo from "../components/UI/Logo";
import SocialIconProps from "./Interfaces/SocialIconProps";

const SocialIcon = ({ icon, href }: SocialIconProps) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-purple-600 transition-colors"
      whileHover={{
        scale: 1.2,
        rotate: [0, -10, 10, 0],
      }}
      transition={{ duration: 0.3 }}
    >
      {icon}
    </motion.a>
  );
};

const Footer = () => {
  const socialIcons = [
    {
      icon: <Icons.Twitter className="w-6 h-6" />,
      href: "https://x.com/yash_parekh147",
    },
    {
      icon: <Icons.Github className="w-6 h-6" />,
      href: "https://github.com/yash-parekh715",
    },
    {
      icon: <Icons.Linkedin className="w-6 h-6" />,
      href: "https://www.linkedin.com/in/yash-parekh-abb5a01b7/",
    },
    {
      icon: <Icons.Instagram className="w-6 h-6" />,
      href: "https://www.instagram.com/__yash__parekh__/",
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-pale-50 py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-pale-50 via-purple-100/15 to-pale-50/50" />
      <div className="absolute inset-0 bg-grid-slate-200/30 bg-[size:20px_20px]" />

      {/* Decorative elements */}
      <motion.div
        className="absolute -top-20 -right-20 w-60 h-60 bg-purple-100 rounded-full filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col items-center justify-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Logo />
          </motion.div>

          {/* Social media icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex space-x-8 mb-8"
          >
            {socialIcons.map((item, index) => (
              <SocialIcon key={index} icon={item.icon} href={item.href} />
            ))}
          </motion.div>

          {/* Copyright text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-gray-500 text-sm">
              © {currentYear} TeamBoard. All rights reserved.
            </p>
          </motion.div>

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-purple-400/20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * -30 - 10],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                repeat: Infinity,
                repeatType: "loop",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
