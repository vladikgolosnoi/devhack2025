import { useEffect } from "react";
import { motion } from "framer-motion";

const alertStyles = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  warn: "bg-yellow-500 text-black",
  info: "bg-blue-500 text-white",
};

const progressBarStyles = {
  success: "bg-green-300 bg-opacity-50",
  error: "bg-red-300 bg-opacity-50",
  warn: "bg-yellow-300 bg-opacity-50",
  info: "bg-blue-300 bg-opacity-50",
};

export default function AlertMessage({ type, message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      key={message}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -70, opacity: 0, transition: { duration: 0.3 } }}
      className={`fixed top-4 left-4 right-4 md:left-auto md:right-auto md:w-96 max-w-xs md:max-w-md px-4 py-3 rounded-lg shadow-lg ${alertStyles[type]}`}
      style={{ zIndex: 1050 }}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm md:text-base">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-lg text-black hover:opacity-70"
        >
          ✖
        </button>
      </div>

      <div className={`w-full h-1 mt-2 ${progressBarStyles[type]}`}>
        <motion.div
          className="h-full"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 3, ease: "linear" }}
          style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
        />
      </div>
    </motion.div>
  );
}
