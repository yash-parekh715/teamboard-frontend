// src/pages/LandingPage.tsx
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { useState } from "react";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Form from "../components/UI/Form";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const LandingPage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const handleSwitchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const handleSwitchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };
  return (
    <div className="bg-pale-50">
      <Navbar
        onLoginClick={() => setIsLoginOpen(true)}
        onSignupClick={() => setIsSignupOpen(true)}
      />
      <Hero onGetStartedClick={() => setIsSignupOpen(true)} />
      <Features />
      <Footer />
      {/* Login Modal */}
      <Form
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        title="Welcome back"
      >
        <LoginForm onSwitchToSignup={handleSwitchToSignup} />
      </Form>

      {/* Signup Modal */}
      <Form
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title="Join us"
      >
        <SignupForm onSwitchToLogin={handleSwitchToLogin} />
      </Form>
    </div>
  );
};

export default LandingPage;
