import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCrown } from "react-icons/fa";
import Sparkles from "react-sparkle";
import { getProfile } from "@/components/api/profile";

export default function PremiumComparison() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const profile = await getProfile();
      setCurrentUser(profile);
    }
    fetchProfile();
  }, []);

  const features = [
    { feature: "Количество сайтов", free: "1", premium: "3" },
    { feature: "Оформление фонов", free: "Базовые", premium: "Эксклюзивные" },
    { feature: "Оформление профиля", free: "Стандартное", premium: "Премиум" },
    { feature: "Изменение рейтинга", free: "+1 / -1", premium: "+2 / -2" },
    {
      feature: "Публикация сайтов",
      free: "Да (Ссылка)",
      premium: "Да (Профиль)",
    },
    {
      feature: "Оформление комментариев",
      free: "Базовый",
      premium: "Особое",
    },
  ];

  return (
    <div className=" py-8 px-4">
      <div className="max-w-5xl bg-white py-5 px-10 mx-auto rounded-2xl">
        {/* Заголовок */}
        <motion.h1
          className="mt-12 text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Наши подписки
        </motion.h1>
        <motion.p
          className="text-center text-xs sm:text-sm text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.2 }}
        >
          Сравните возможности бесплатного и премиум тарифов, чтобы выбрать
          оптимальный для себя вариант.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Бесплатная подписка */}
          <motion.div
            className="border rounded-2xl p-4 sm:p-6 shadow-lg bg-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              Бесплатная подписка
            </h2>
            <ul className="list-disc pl-4 sm:pl-6 space-y-2">
              {features.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between text-xs sm:text-sm"
                >
                  <span className="text-gray-700">{item.feature}</span>
                  <span className="text-gray-900 font-semibold">
                    {item.free}
                  </span>
                </li>
              ))}
            </ul>
            {currentUser && currentUser.subscription === "free" && (
              <div className="mt-4">
                <p className="text-center text-xs sm:text-sm text-gray-700 font-semibold">
                  Ваша подписка
                </p>
              </div>
            )}
          </motion.div>
          {/* Премиум подписка */}
          <motion.div
            className="relative border-4 rounded-2xl p-4 sm:p-6 shadow-2xl bg-gradient-to-r from-yellow-100 to-yellow-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {/* Sparkles эффект для премиум карточки */}
            <div className="absolute inset-0 pointer-events-none">
              <Sparkles
                count={30}
                overflowPx={0}
                fadeOutSpeed={10}
                flickerSpeed={30}
                color="#ffcc00"
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                }}
              />
            </div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <FaCrown className="text-yellow-500 text-3xl mr-2" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Премиум подписка
                </h2>
              </div>
              <ul className="list-disc pl-4 sm:pl-6 space-y-2">
                {features.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-xs sm:text-sm"
                  >
                    <span className="text-gray-700">{item.feature}</span>
                    <span className="text-gray-900 font-semibold">
                      {item.premium}
                    </span>
                  </li>
                ))}
              </ul>
              {currentUser && (
                <div className="mt-4">
                  {currentUser.subscription === "free" ? (
                    <motion.button
                      className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-full shadow cursor-not-allowed opacity-70"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled
                    >
                      Купить подписку (скоро в продаже)
                    </motion.button>
                  ) : currentUser.subscription === "premium" ? (
                    <p className="text-center text-xs sm:text-sm text-green-600 font-bold">
                      Ваша подписка
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
