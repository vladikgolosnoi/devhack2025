import { useState, useEffect } from "react";
import { getProfile, getPublishedWebsites } from "@/components/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCrown, FaEye, FaArrowRight } from "react-icons/fa";

function getReputationColor(rep) {
  if (rep <= -1) return "bg-red-500 text-white";
  if (rep === 0) return "bg-gray-500 text-white";
  if (rep >= 1 && rep < 10) return "bg-green-500 text-white";
  if (rep >= 10 && rep < 50) return "bg-blue-500 text-white";
  if (rep >= 50) return "bg-yellow-500 text-white";
  return "bg-gray-500 text-white";
}

const DynamicText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return <p>{displayedText}</p>;
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [websites, setWebsites] = useState([]);

  useEffect(() => {
    async function fetchProfile() {
      const userProfile = await getProfile();
      setProfile(userProfile);
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      async function fetchWebsites() {
        const publishedWebsites = await getPublishedWebsites(profile.user.id);
        setWebsites(publishedWebsites);
      }
      fetchWebsites();
    }
  }, [profile]);

  if (!profile) return <p className="text-center text-gray-500">Загрузка...</p>;

  const isPremium = profile.subscription === "premium";
  const textClass = isPremium ? "text-white" : "text-black";

  return (
    <>
      <style>{`
          @keyframes shimmer {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .premium-bg {
            background-size: 200% 200%;
            animation: shimmer 5s linear infinite;
          }
        `}</style>
      <motion.div
        className={`max-w-3xl mx-auto mt-10 p-8 shadow-2xl rounded-xl border-4 ${
          isPremium
            ? "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 border-yellow-400 premium-bg"
            : "bg-white border-white"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {isPremium && (
          <motion.div
            className="flex justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
          >
            <FaCrown className="text-yellow-400 text-4xl mb-2" />
          </motion.div>
        )}
        <motion.div
          className="flex flex-col sm:flex-row items-center mb-6"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <motion.img
            src={
              profile.avatar
                ? `http://localhost:8000${profile.avatar}`
                : "/default-avatar.png"
            }
            alt="Аватар"
            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-2xl mb-4 sm:mb-0 sm:mr-6"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 justify-center sm:justify-start">
              <h2
                className={`text-4xl font-extrabold mb-2 text-center sm:text-left ${textClass}`}
              >
                {profile.user.first_name} {profile.user.last_name}{" "}
                {profile.middle_name}
              </h2>
            </div>
            <div className="flex items-center space-x-2 justify-center sm:justify-start">
              <p className={`text-lg opacity-80 ${textClass}`}>
                @{profile.user.username}
              </p>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${getReputationColor(
                  profile.reputation
                )}`}
                title="Репутация"
              >
                {profile.reputation}
              </span>
              <p className={`ml-2 text-lg opacity-80 ${textClass}`}>
                | {profile.profession || "Не указано"}
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div className="flex items-center space-x-2">
            <span className="text-2xl">📧</span>
            <p className={textClass}>{profile.user.email}</p>
          </motion.div>
          <motion.div className="flex items-center space-x-2">
            <span className="text-2xl">🎂</span>
            <p className={textClass}>{profile.age || "Не указано"}</p>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-6 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center flex-col items-center">
            <span className="text-4xl mb-2">📖</span>
            {isPremium ? (
              <div className="text-white">
                <DynamicText text={profile.bio || "Не указано"} />
              </div>
            ) : (
              <p className={textClass}>{profile.bio || "Не указано"}</p>
            )}
          </div>
        </motion.div>

        {/* Блок опубликованных сайтов */}
        {websites.length > 0 && (
          <motion.div
            className={`max-w-3xl mx-auto mt-8 p-8 shadow-2xl rounded-xl border-4 ${
              isPremium
                ? "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 border-yellow-400 premium-bg"
                : "bg-white border-white"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className={`text-2xl font-bold mb-4 ${textClass}`}>Сайты</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {websites.map((website) => (
                <motion.div
                  key={website.id}
                  className={`p-4 border rounded shadow ${
                    isPremium ? "bg-white" : "bg-gray-100"
                  } flex flex-col justify-between h-full`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Верхняя часть */}
                  <div>
                    <h4 className="text-lg font-semibold">{website.name}</h4>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaEye className="mr-1" />
                    <span>{website.views}</span>
                  </div>
                  {/* Нижняя часть: кнопка */}
                  <div className="mt-4">
                    <Link to={`/${profile.user.username}/${website.unique_id}`}>
                      <motion.button
                        className="w-full flex items-center justify-center bg-indigo-700 text-white px-3 py-2 rounded hover:shadow-lg transition duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Посетить <FaArrowRight className="ml-1" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/profile/update">
            <motion.button
              className="bg-indigo-700 text-white px-8 py-4 rounded-full text-xl font-semibold transform hover:scale-105 transition duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              ✏️ Редактировать профиль
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
}
