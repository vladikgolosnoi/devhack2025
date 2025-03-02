import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import {
  getProfile,
  logout,
  getNotifications,
  claimGift,
  markNotificationsRead,
} from "@/components/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaCrown } from "react-icons/fa";
import AlertMessage from "@/components/ui/AlertMessage";

export default function Navbar() {
  // Проверка на мобильный вид (ширина экрана ≤ 1050px)
  const isMobileView = useMediaQuery({ query: "(max-width: 1050px)" });

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileNotifOpen, setMobileNotifOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const desktopNotifRef = useRef(null);

  // Обработчик клика вне выпадающих окон
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
      if (
        desktopNotifRef.current &&
        !desktopNotifRef.current.contains(event.target)
      ) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Получение профиля
  useEffect(() => {
    async function fetchProfile() {
      const profile = await getProfile();
      if (profile) setUser(profile);
    }
    if (localStorage.getItem("access_token")) fetchProfile();
  }, []);

  // Получение уведомлений для авторизованного пользователя
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Ошибка загрузки уведомлений", error);
      }
    }
    if (user) fetchNotifications();
  }, [user]);

  // Автоматическая отметка уведомлений как прочитанных (desktop)
  useEffect(() => {
    if (notifOpen && notifications.some((n) => !n.is_read)) {
      async function markRead() {
        try {
          await markNotificationsRead();
          setNotifications((prev) =>
            prev.map((n) => ({ ...n, is_read: true }))
          );
        } catch (error) {
          console.error("Ошибка при отметке уведомлений (desktop)", error);
        }
      }
      markRead();
    }
  }, [notifOpen, notifications]);

  // Автоматическая отметка уведомлений как прочитанных для мобильной версии
  useEffect(() => {
    if (mobileNotifOpen && notifications.some((n) => !n.is_read)) {
      async function markReadMobile() {
        try {
          await markNotificationsRead();
          setNotifications((prev) =>
            prev.map((n) => ({ ...n, is_read: true }))
          );
        } catch (error) {
          console.error("Ошибка при отметке уведомлений (mobile)", error);
        }
      }
      markReadMobile();
    }
  }, [mobileNotifOpen, notifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Обработка клика по кнопке получения подарка
  const handleGiftClaim = async (notifId) => {
    try {
      const data = await claimGift();
      setAlertMessage({ type: "success", message: data.detail });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, claimed: true } : n))
      );
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error.message || "Ошибка при получении подарка",
      });
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
  };

  function NavLink({ to, children, onClick }) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className="text-gray-700 hover:text-black transition duration-200"
      >
        {children}
      </Link>
    );
  }

  return (
    <>
      {/* Стили для анимации градиентного бейджа PREMIUM */}
      <style>{`
          @keyframes slideGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-slide {
            background-size: 200% 200%;
            animation: slideGradient 4s linear infinite;
          }
        `}</style>
      {alertMessage && (
        <AlertMessage
          type={alertMessage.type}
          message={alertMessage.message}
          onClose={() => setAlertMessage(null)}
        />
      )}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white bg-opacity-90 backdrop-blur-lg shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-extrabold text-gray-800">
            ПреподОнлайн
          </Link>
          {!isMobileView && (
            <div className="flex space-x-8">
              <NavLink to="/teachers">Преподаватели</NavLink>
              <NavLink to="/rating">Рейтинг</NavLink>
              <NavLink to="/sites">Сайты</NavLink>
              <NavLink to="/subscription">Подписка</NavLink>
            </div>
          )}
          {!isMobileView && (
            <>
              {user && (
                <div className="flex items-center space-x-4">
                  <div className="relative" ref={desktopNotifRef}>
                    <button
                      onClick={() => setNotifOpen(!notifOpen)}
                      className="relative p-2 hover:bg-gray-100 rounded-full transition duration-200"
                    >
                      <FaBell className="text-2xl text-gray-700" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    <AnimatePresence>
                      {notifOpen && (
                        <motion.div
                          className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg border overflow-hidden z-50"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 10 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          {notifications.length === 0 ? (
                            <div className="px-4 py-2 text-gray-600">
                              Нет уведомлений
                            </div>
                          ) : (
                            notifications.map((notif) => (
                              <div
                                key={notif.id}
                                className="px-4 py-2 border-b last:border-0"
                              >
                                <p className="text-gray-700">{notif.message}</p>
                                {notif.type === "gift" && !notif.claimed && (
                                  <div className="flex justify-center">
                                    <motion.button
                                      onClick={() => handleGiftClaim(notif.id)}
                                      className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-full shadow-md"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      Получить подарок
                                    </motion.button>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Профиль с эффектами для premium */}
                  <div className="relative" ref={dropdownRef}>
                    <motion.button
                      className="flex items-center space-x-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition duration-200"
                      onClick={() => setMenuOpen(!menuOpen)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="relative">
                        {/* Обёртка для аватара с градиентной обводкой для premium */}
                        <div
                          className={`rounded-full p-1 ${
                            user.subscription === "premium"
                              ? "bg-gradient-to-r from-yellow-400 via-yellow-100 to-yellow-500"
                              : "bg-transparent"
                          }`}
                        >
                          <img
                            src={
                              user.avatar
                                ? `http://localhost:8000${user.avatar}`
                                : "/default-avatar.png"
                            }
                            alt="Профиль"
                            className="w-10 h-10 object-cover rounded-full border border-gray-300 shadow-sm"
                          />
                        </div>
                        {/* Корона для премиум-пользователя */}
                        {user.subscription === "premium" && (
                          <div className="absolute -top-1 -right-1">
                            <FaCrown className="text-yellow-400 text-xl" />
                          </div>
                        )}
                      </div>
                      <span className="text-gray-800 font-semibold">
                        {user.user.first_name || user.user.username}
                      </span>
                      {/* Бейдж для премиум-пользователя */}
                      {user.subscription === "premium" && (
                        <span className="px-2 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 animate-slide">
                          PREMIUM
                        </span>
                      )}
                    </motion.button>
                    <AnimatePresence>
                      {menuOpen && (
                        <motion.div
                          className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 10 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                            onClick={() => setMenuOpen(false)}
                          >
                            Профиль
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-b-lg"
                          >
                            Выйти
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
              {/* Для незалогиненных пользователей */}
              {!user && (
                <div>
                  <Link
                    to="/auth"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                  >
                    Войти / Регистрация
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Мобильные элементы (бургер-меню и кнопка уведомлений) */}
          {isMobileView && (
            <div className="flex items-center space-x-2">
              {user && (
                <button
                  onClick={() => setMobileNotifOpen(!mobileNotifOpen)}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition duration-200"
                >
                  <FaBell className="text-2xl text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}
              <button
                className="text-gray-700 text-2xl"
                onClick={() => setIsOpen(!isOpen)}
              >
                ☰
              </button>
            </div>
          )}
        </div>
        {/* Мобильное меню для навигации с дополнительным профилем для premium */}
        {isMobileView && (
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="bg-white shadow-md"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="flex flex-col items-center space-y-4 py-4"
                  ref={menuRef}
                >
                  {/* Блок профиля для мобильных */}
                  {user && (
                    <div className="flex flex-col items-center space-y-2 mb-4">
                      <div className="relative">
                        <div
                          className={`rounded-full p-1 ${
                            user.subscription === "premium"
                              ? "bg-gradient-to-r from-yellow-400 via-yellow-100 to-yellow-500"
                              : "bg-transparent"
                          }`}
                        >
                          <img
                            src={
                              user.avatar
                                ? `http://localhost:8000${user.avatar}`
                                : "/default-avatar.png"
                            }
                            alt="Профиль"
                            className="w-16 h-16 rounded-full object-cover border border-gray-300 shadow-sm"
                          />
                        </div>
                        {user.subscription === "premium" && (
                          <div className="absolute -top-1 -right-1">
                            <FaCrown className="text-yellow-400 text-xl" />
                          </div>
                        )}
                      </div>
                      <span className="text-gray-800 font-semibold">
                        {user.user.first_name || user.user.username}
                      </span>
                      {user.subscription === "premium" && (
                        <span className="px-2 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 animate-slide">
                          PREMIUM
                        </span>
                      )}
                    </div>
                  )}
                  <NavLink to="/teachers" onClick={() => setIsOpen(false)}>
                    Преподаватели
                  </NavLink>
                  <NavLink to="/rating" onClick={() => setIsOpen(false)}>
                    Рейтинг
                  </NavLink>
                  <NavLink to="/sites" onClick={() => setIsOpen(false)}>
                    Сайты
                  </NavLink>
                  <NavLink to="/subscription" onClick={() => setIsOpen(false)}>
                    Подписка
                  </NavLink>
                  {user ? (
                    <>
                      <NavLink to="/profile" onClick={() => setIsOpen(false)}>
                        Профиль
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="text-red-600 hover:underline"
                      >
                        Выйти
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Войти / Регистрация
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </nav>
      {/* Оверлей уведомлений для мобильной версии */}
      {isMobileView && (
        <AnimatePresence>
          {mobileNotifOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-xl z-50 overflow-y-auto max-h-3/4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Уведомления</h2>
                <button onClick={() => setMobileNotifOpen(false)}>✖</button>
              </div>
              {notifications.length === 0 ? (
                <div className="text-gray-600">Нет уведомлений</div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="border-b py-2">
                    <p className="text-gray-700">{notif.message}</p>
                    {notif.type === "gift" && !notif.claimed && (
                      <div className="flex justify-center mt-2">
                        <motion.button
                          onClick={() => handleGiftClaim(notif.id)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-full shadow-md"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Получить подарок
                        </motion.button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
