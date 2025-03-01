import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getWebsites,
  createWebsite,
  deleteWebsite,
  togglePublishWebsite,
} from "@/components/api/sites";
import { getProfile } from "@/components/api/profile";
import AlertMessage from "@/components/ui/AlertMessage";
import { FaEye, FaCrown } from "react-icons/fa";

export default function Sites() {
  const [sites, setSites] = useState([]);
  const [maxSites, setMaxSites] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [siteType, setSiteType] = useState("minimalism");
  const [siteName, setSiteName] = useState("");
  const [username, setUsername] = useState("username");
  const [copyLinkModal, setCopyLinkModal] = useState(false);
  const [copyLinkValue, setCopyLinkValue] = useState("");
  const [alert, setAlert] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();

  const getDefaultHomeBlock = () => ({
    id: Date.now(),
    blockType: "home",
    sectionTitle: "Добро пожаловать!",
    sectionDescription: "",
    sectionColor: "#ffffff",
    itemsGrid: 2,
    itemStyle: "home",
    collapsed: false,
    locked: true,
    items: [
      {
        id: Date.now() + 1,
        title: "Профессия",
        description: "Описание слогана и краткая информация.",
        image:
          "https://avatars.dzeninfra.ru/get-zen_doc/230865/pub_5b5032f086603300a9cca63f_5b5033074cfa8b00ab54d1e4/scale_1200",
      },
    ],
  });

  useEffect(() => {
    loadSites();
    loadProfile();
  }, []);

  const loadSites = async () => {
    try {
      const data = await getWebsites();
      setSites(data);
    } catch (error) {
      console.error("Ошибка загрузки сайтов", error);
    }
  };

  const loadProfile = async () => {
    try {
      const profileData = await getProfile();
      if (profileData && profileData.user && profileData.user.username) {
        setUsername(profileData.user.username);
        if (
          profileData.subscription &&
          profileData.subscription.toLowerCase() === "premium"
        ) {
          setMaxSites(3);
          setIsPremium(true);
        } else {
          setMaxSites(1);
          setIsPremium(false);
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки профиля:", error);
    }
  };

  const handleCreateSite = async () => {
    if (sites.length >= maxSites) return;
    const defaultHomeBlock = getDefaultHomeBlock();
    const payload = {
      name: siteName,
      site_type: siteType,
      data: { pageBackground: "#ffffff", blocks: [defaultHomeBlock] },
    };
    try {
      const newSite = await createWebsite(payload);
      setSites([...sites, newSite]);
      setShowModal(false);
      setSiteName("");
    } catch (error) {
      console.error("Ошибка создания сайта", error);
    }
  };

  const handleDeleteSite = async (unique_id) => {
    try {
      await deleteWebsite(username, unique_id);
      setSites(sites.filter((site) => site.unique_id !== unique_id));
    } catch (error) {
      console.error("Ошибка удаления сайта", error);
    }
  };

  const handleEditSite = (site) => {
    if (site.site_type === "minimalism") {
      navigate("/coding");
    } else {
      navigate(`/constructor/${site.unique_id}`);
    }
  };

  const handleCopyLink = (site) => {
    // Формируем ссылку с базовым доменом
    const link = `${window.location.origin}/${username}/${site.unique_id}`;
    setCopyLinkValue(link);
    setCopyLinkModal(true);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(copyLinkValue)
      .then(() => setAlert({ type: "info", message: "Ссылка скопирована!" }))
      .catch(() =>
        setAlert({ type: "error", message: "Ошибка копирования ссылки" })
      );
  };

  const handleViewSite = (site) => {
    // Формируем ссылку с базовым доменом
    const link = `${window.location.origin}/${username}/${site.unique_id}`;
    window.open(link, "_blank");
  };

  // Функция для переключения статуса публикации сайта (только для премиум-пользователей)
  const handleTogglePublishSite = async (site) => {
    if (!isPremium) return;
    try {
      const updatedSite = await togglePublishWebsite(
        site.unique_id,
        !site.show_in_profile
      );
      setSites(
        sites.map((s) => (s.unique_id === site.unique_id ? updatedSite : s))
      );
      setAlert({
        type: "info",
        message: updatedSite.show_in_profile
          ? "Сайт опубликован в профиле"
          : "Сайт отвязан от профиля",
      });
    } catch (error) {
      console.error("Ошибка обновления публикации сайта", error);
      setAlert({
        type: "error",
        message: "Ошибка обновления публикации сайта",
      });
    }
  };

  let progressColor = "bg-gray-300";
  if (maxSites === 3) {
    if (sites.length === 1) progressColor = "bg-green-500";
    else if (sites.length === 2) progressColor = "bg-orange-500";
    else if (sites.length === 3) progressColor = "bg-red-500";
  } else {
    progressColor = sites.length === 1 ? "bg-red-500" : "bg-gray-300";
  }

  const progressMessage =
    sites.length >= maxSites ? (
      <span className="text-red-500">
        Максимум сайтов для вашей подписки достигнут
      </span>
    ) : (
      <span className="text-green-500">Доступно создание сайта</span>
    );

  const headerTextClass = isPremium ? "text-white" : "text-black";

  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      {/* Контейнер для уведомления, расположенный сверху по центру */}
      {alert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}
      <div className="max-w-5xl mx-auto">
        {/* Заголовок и прогресс-бар */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`rounded-lg mb-10 text-center py-12 px-6 sm:px-12 ${
            isPremium
              ? "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 border-4 border-yellow-400 premium-bg"
              : "bg-gray-50"
          }`}
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
          <h1
            className={`text-3xl sm:text-4xl font-extrabold ${headerTextClass}`}
          >
            Мои сайты
          </h1>
          <p className={`mt-2 text-base sm:text-lg ${headerTextClass}`}>
            {sites.length} / {maxSites} созданных сайтов
          </p>
          <div className="mt-6">
            <div className="w-full h-4 rounded-full bg-gray-200 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(sites.length / maxSites) * 100}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full ${progressColor} rounded-full`}
              />
            </div>
            <p className="mt-2 text-sm font-medium">{progressMessage}</p>
          </div>
          {sites.length < maxSites && (
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-xl hover:shadow-2xl transition"
              >
                Создать сайт
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Список сайтов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sites.map((site) => (
            <motion.div
              key={site.unique_id}
              whileHover={{ scale: 1.02 }}
              className={`rounded-2xl shadow-lg p-6 transition-transform duration-300 relative ${
                isPremium
                  ? "bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 border-4 border-yellow-300"
                  : "bg-white"
              }`}
            >
              <div className="mb-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  {site.name}
                </h2>
                <p className="text-sm text-gray-500">{`${username}/${site.unique_id}`}</p>
              </div>
              {/* Отображение количества просмотров */}
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <FaEye className="mr-1" />
                <span>{site.views} просмотров</span>
              </div>
              {/* Ряд с основными кнопками */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleEditSite(site)}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition flex items-center justify-center"
                >
                  <span className="mr-1">✏️</span>Редактировать
                </button>
                <button
                  onClick={() => handleDeleteSite(site.unique_id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition flex items-center justify-center"
                >
                  <span className="mr-1">🗑️</span>Удалить
                </button>
                <button
                  onClick={() => handleCopyLink(site)}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition flex items-center justify-center"
                >
                  <span className="mr-1">🔗</span>Получить ссылку
                </button>
                <button
                  onClick={() => handleViewSite(site)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition flex items-center justify-center"
                >
                  <FaEye className="mr-1" />
                  <span>Просмотр</span>
                </button>
              </div>
              {/* Отдельный ряд для кнопки публикации */}
              <div className="mt-3">
                <button
                  onClick={() => isPremium && handleTogglePublishSite(site)}
                  className={`w-full px-4 py-2 rounded-lg shadow transition flex items-center justify-center ${
                    isPremium
                      ? "bg-purple-500 hover:bg-purple-600 text-white"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  title={
                    !isPremium
                      ? "Публикация доступна только для подписчиков премиум"
                      : ""
                  }
                >
                  <span className="mr-1">🚀</span>
                  <span>
                    {site.show_in_profile
                      ? "Отвязать от профиля"
                      : "Опубликовать"}
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Модальное окно создания сайта */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Создать сайт
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Выберите тип сайта
                </label>
                <select
                  value={siteType}
                  onChange={(e) => setSiteType(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="minimalism">Minimalism Сайт</option>
                  <option value="constructor">Конструктор</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название сайта
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Введите название сайта"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                  onClick={handleCreateSite}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Создать сайт
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition"
                >
                  Отмена
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальное окно для копирования ссылки */}
      <AnimatePresence>
        {copyLinkModal && (
          <motion.div
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -200, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Скопировать ссылку
              </h2>
              <div className="mb-4">
                <input
                  type="text"
                  value={copyLinkValue}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-200 text-gray-800"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                  onClick={handleCopyToClipboard}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Копировать
                </button>
                <button
                  onClick={() => setCopyLinkModal(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition"
                >
                  Выход
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
