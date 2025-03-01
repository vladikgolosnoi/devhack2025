import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setShowBanner(true);
  }, []);

  const handleConsent = (choice) => {
    localStorage.setItem("cookieConsent", choice);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="fixed bottom-0 left-0 w-full md:bottom-6 md:left-5 md:right-5 md:w-[700px] max-w-full md:max-w-lg bg-white bg-opacity-90 backdrop-blur-lg text-black p-4 md:p-6 rounded-none md:rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-300 md:border md:border-gray-300"
      style={{ zIndex: 1050 }}
    >
      <div className="flex items-center gap-3 text-center md:text-left">
        <span className="text-2xl">🍪</span>
        <span className="text-sm md:text-base font-medium">
          Мы используем куки для улучшения работы сайта.
        </span>
      </div>
      <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
        <button
          onClick={() => handleConsent("accepted")}
          className="bg-black w-full md:w-auto px-5 py-2 rounded text-white text-sm md:text-base hover:bg-gray-800 transition"
        >
          Принять
        </button>
        <button
          onClick={() => handleConsent("declined")}
          className="bg-gray-300 w-full md:w-auto px-5 py-2 rounded text-black text-sm md:text-base hover:bg-gray-400 transition"
        >
          Отказаться
        </button>
      </div>
    </motion.div>
  );
}
