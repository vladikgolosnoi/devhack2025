import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiRequest } from "@/components/api";
import { updateRating, getProfile } from "@/components/api/profile";
import { getPublishedWebsites } from "@/components/api/sites";
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

export default function ProfileId() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [websites, setWebsites] = useState([]);
  const navigate = useNavigate();

  // 1. Загрузка профиля
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await apiRequest(`/accounts/users/${id}/`, "GET");
        if (!response) {
          navigate("/404");
        } else {
          setProfile(response);
        }
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
        navigate("/404");
      }
    }
    fetchProfile();
  }, [id, navigate]);

  // 2. Текущий пользователь
  useEffect(() => {
    async function fetchCurrentUser() {
      const userProfile = await getProfile();
      setCurrentUser(userProfile);
    }
    fetchCurrentUser();
  }, []);

  // 3. Редирект, если пользователь смотрит свой же профиль
  useEffect(() => {
    if (profile && currentUser) {
      if (profile.user.id === currentUser.user.id) {
        navigate("/profile");
      }
    }
  }, [profile, currentUser, navigate]);

  // 4. Проверка голосования
  useEffect(() => {
    async function fetchRatingStatus() {
      if (profile && currentUser) {
        try {
          const res = await apiRequest(
            `/accounts/profile/${profile.user.id}/rating/status/`,
            "GET"
          );
          if (res.has_voted) {
            setHasVoted(true);
          }
        } catch (error) {
          console.error("Ошибка получения статуса голосования:", error);
        }
      }
    }
    fetchRatingStatus();
  }, [profile, currentUser]);

  // 5. Загрузка опубликованных сайтов
  useEffect(() => {
    async function fetchWebsites() {
      if (profile && profile.user && profile.user.id) {
        try {
          const res = await getPublishedWebsites(profile.user.id);
          setWebsites(res);
        } catch (error) {
          console.error("Ошибка загрузки сайтов:", error);
        }
      }
    }
    fetchWebsites();
  }, [profile]);

  if (!profile) {
    return <p className="text-center text-gray-500">Загрузка...</p>;
  }

  const isPremium = profile.subscription === "premium";
  const headerTextClass = isPremium ? "text-white" : "text-black";

  const handleIncreaseRating = async () => {
    const value = currentUser?.profile?.subscription === "premium" ? 2 : 1;
    try {
      const res = await updateRating(profile.user.id, "plus", value);
      if (res.has_voted) {
        setHasVoted(true);
        window.location.reload();
      }
    } catch (error) {
      console.error("Ошибка обновления рейтинга:", error);
    }
  };

  const handleDecreaseRating = async () => {
    try {
      const res = await updateRating(profile.user.id, "minus");
      if (res.has_voted) {
        setHasVoted(true);
        window.location.reload();
      }
    } catch (error) {
      console.error("Ошибка обновления рейтинга:", error);
    }
  };

  return (
    <>
      {/* Стили для shimmer-эффекта (премиум) */}
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

      {/* Общий контейнер: фон, градиент и т.д. */}
      <motion.div
        className={`max-w-5xl mx-auto mt-10 p-8 shadow-2xl rounded-xl border-4 ${
          isPremium
            ? "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 border-yellow-400 premium-bg"
            : "bg-white border-gray-200"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Сетка: 2 колонки (левая - профиль, правая - сайты) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Левая колонка: Информация о профиле */}
          <div className="md:col-span-2">
            {isPremium && (
              <motion.div
                className="flex justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
              >
                <FaCrown className="text-yellow-400 text-5xl" title="Премиум" />
              </motion.div>
            )}

            <motion.div
              className="flex flex-col sm:flex-row items-center mb-4"
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
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-4 sm:mb-0 sm:mr-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col items-start">
                  <h2 className={`text-3xl font-bold ${headerTextClass}`}>
                    {profile.user.first_name} {profile.user.last_name}{" "}
                    {profile.middle_name}
                  </h2>
                  <div className="flex items-center mt-1">
                    <p className={`text-lg opacity-80 ${headerTextClass}`}>
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
                    <p className={`ml-2 text-lg opacity-80 ${headerTextClass}`}>
                      | {profile.profession || "Не указано"}
                    </p>
                  </div>

                  {/* Кнопки голосования (если пользователь не голосовал) */}
                  {!hasVoted && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleIncreaseRating}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 transition shadow-sm text-white text-base"
                        title={`Увеличить рейтинг на ${
                          currentUser?.profile?.subscription === "premium"
                            ? "2"
                            : "1"
                        }`}
                      >
                        +
                      </button>
                      <button
                        onClick={handleDecreaseRating}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 transition shadow-sm text-white text-base"
                        title="Уменьшить рейтинг на 1"
                      >
                        –
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Блок с email / возраст */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📧</span>
                <p className={headerTextClass}>{profile.user.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎂</span>
                <p className={headerTextClass}>{profile.age || "Не указано"}</p>
              </div>
            </motion.div>

            {/* Блок «О себе» / Bio */}
            <motion.div
              className="mt-6 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-2">📖</span>
                {isPremium ? (
                  <div className="text-white">
                    <DynamicText text={profile.bio || "Не указано"} />
                  </div>
                ) : (
                  <p className={headerTextClass}>
                    {profile.bio || "Не указано"}
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Правая колонка: блок «Сайты», если есть опубликованные */}
          <div className="md:col-span-1">
            {websites.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-xl p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-black">Сайты</h3>
                <div className="grid grid-cols-1 gap-4">
                  {websites.map((website) => (
                    <motion.div
                      key={website.id}
                      className="p-4 border rounded shadow bg-gray-100 flex flex-col justify-between"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Название сайта */}
                      <div>
                        <h4 className="text-lg font-semibold">
                          {website.name}
                        </h4>
                      </div>
                      {/* Просмотры */}
                      <div className="flex items-center text-gray-600 mb-2">
                        <FaEye className="mr-1" />
                        <span>{website.views}</span>
                      </div>
                      {/* Кнопка «Посетить» */}
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
          </div>
        </div>
      </motion.div>
    </>
  );
}
