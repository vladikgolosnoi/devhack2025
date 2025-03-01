import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiRequest } from "@/components/api";
import { updateRating, getProfile } from "@/components/api/profile";
import { motion } from "framer-motion";
import { FaCrown } from "react-icons/fa";

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
  const navigate = useNavigate();

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

  // Получаем текущего пользователя
  useEffect(() => {
    async function fetchCurrentUser() {
      const userProfile = await getProfile();
      setCurrentUser(userProfile);
    }
    fetchCurrentUser();
  }, []);

  // Если текущий пользователь заходит на свой профиль, редирект на /profile
  useEffect(() => {
    if (profile && currentUser) {
      if (profile.user.id === currentUser.user.id) {
        navigate("/profile");
      }
    }
  }, [profile, currentUser, navigate]);

  // GET запрос для проверки, голосовал ли уже текущий пользователь за этот профиль
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

  if (!profile) return <p className="text-center text-gray-500">Загрузка...</p>;

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
      {/* Стили для shimmer-эффекта для премиум фона */}
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
            : "bg-white border-gray-200"
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
            className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 sm:mb-0 sm:mr-4"
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
              {/* Блок с username и бейджем репутации */}
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
              {/* Если пользователь ещё не голосовал, отображаем маленькие кнопки голосования под username */}
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
              <p className={headerTextClass}>{profile.bio || "Не указано"}</p>
            )}
          </div>
        </motion.div>

        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/profile/update">
            <motion.button
              className="bg-indigo-700 text-white px-6 py-3 rounded-full text-lg font-semibold transform hover:scale-105 transition duration-300"
              whileHover={{ scale: 1.05 }}
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
