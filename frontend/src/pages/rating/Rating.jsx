import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCrown, FaFire } from "react-icons/fa";
import Sparkles from "react-sparkle";
import { getTopProfiles } from "@/components/api/profile";

const medalStyles = [
  "bg-yellow-500 text-white", // ТОП 1: золотой стиль
  "bg-gray-400 text-black", // ТОП 2: серебряный стиль
  "bg-orange-500 text-white", // ТОП 3: бронзовый стиль
];

const topBadgeLabels = ["ТОП 1", "ТОП 2", "ТОП 3"];

export default function Rating() {
  const [topProfiles, setTopProfiles] = useState([]);

  useEffect(() => {
    async function fetchTopProfiles() {
      try {
        const data = await getTopProfiles();
        setTopProfiles(data);
      } catch (error) {
        console.error("Ошибка загрузки топ преподавателей", error);
      }
    }
    fetchTopProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold text-center mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Топ 10 Преподавателей
        </motion.h1>
        <motion.p
          className="text-center text-sm sm:text-base text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Чтобы попасть в рейтинг, повышайте свою репутацию, участвуйте в
          образовательных проектах и помогайте коллегам. Узнайте, кто из
          преподавателей лидирует!
        </motion.p>
        <div className="space-y-3 sm:space-y-4">
          {topProfiles.map((profile, index) => {
            let medalStyle = "bg-blue-500 text-white";
            let additionalBorder = "border border-transparent";
            let badgeLabel = "";
            if (index < 3) {
              medalStyle = medalStyles[index];
              badgeLabel = topBadgeLabels[index];
              if (index === 0) {
                additionalBorder = "border-4 border-yellow-500";
              } else if (index === 1) {
                additionalBorder = "border-4 border-gray-400";
              } else if (index === 2) {
                additionalBorder = "border-4 border-orange-500";
              }
            }
            return (
              <motion.div
                key={profile.user.id}
                className={`relative p-3 sm:p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between bg-white ${additionalBorder}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Если карточка входит в ТОП 1-3, отрисовываем индивидуальный Sparkles эффект на всю карточку */}
                {index < 3 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {(() => {
                      if (index === 0) {
                        return (
                          <Sparkles
                            count={50}
                            overflowPx={0}
                            fadeOutSpeed={10}
                            flickerSpeed={20}
                            color="#ffcc00"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              pointerEvents: "none",
                              background: "transparent",
                              zIndex: 1,
                            }}
                          />
                        );
                      } else if (index === 1) {
                        return (
                          <Sparkles
                            count={30}
                            overflowPx={0}
                            fadeOutSpeed={10}
                            flickerSpeed={30}
                            color="#c0c0c0"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              pointerEvents: "none",
                              background: "transparent",
                              zIndex: 1,
                            }}
                          />
                        );
                      } else if (index === 2) {
                        return (
                          <Sparkles
                            count={30}
                            overflowPx={0}
                            fadeOutSpeed={10}
                            flickerSpeed={30}
                            color="#cd7f32"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              pointerEvents: "none",
                              background: "transparent",
                              zIndex: 1,
                            }}
                          />
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <img
                      src={
                        profile.avatar ? profile.avatar : "/default-avatar.png"
                      }
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {/* Если профиль входит в ТОП 1-3, показываем бейдж */}
                    {index < 3 && (
                      <div className="absolute -top-2 -left-2">
                        <div className="px-2 py-1 rounded-full bg-black text-white text-xs font-bold shadow-lg">
                          {badgeLabel}
                        </div>
                      </div>
                    )}
                    {/* Дополнительная иконка огня */}
                    {index < 3 && (
                      <div className="absolute -top-2 -right-2 animate-pulse">
                        <FaFire className="text-red-500 text-xl" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-base sm:text-xl font-bold">
                      {profile.user.first_name} {profile.user.last_name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      @{profile.user.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 relative z-10 mt-2 sm:mt-0">
                  <div
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${medalStyle}`}
                  >
                    {profile.reputation} 🔥
                  </div>
                  {profile.subscription === "premium" && (
                    <FaCrown
                      className="text-yellow-400 text-xl"
                      title="Премиум"
                    />
                  )}
                  <Link to={`/profile/${profile.user.id}`}>
                    <motion.button
                      className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-xs sm:text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Профиль
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
