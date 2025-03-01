import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-6xl font-extrabold text-red-600"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          404
        </motion.h1>
        <motion.p
          className="text-2xl mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Ой! Страница не найдена.
        </motion.p>

        <motion.div
          className="text-lg text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p>
            Мы не можем найти то, что вы ищете. Попробуйте вернуться на главную
            страницу.
          </p>
          <Link
            to="/"
            className="text-red-600 hover:text-red-400 mt-4 inline-block"
          >
            Вернуться на главную
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
