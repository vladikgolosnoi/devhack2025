import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "@/components/api";
import AlertMessage from "@/components/ui/AlertMessage";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ProfileUpdate() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [alert, setAlert] = useState(null);
  const [avatarFileName, setAvatarFileName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const userProfile = await getProfile();
      setProfile(userProfile);
      setFormData({
        email: userProfile.user.email || "",
        first_name: userProfile.user.first_name || "",
        last_name: userProfile.user.last_name || "",
        middle_name: userProfile.middle_name || "",
        age: userProfile.age || "",
        profession: userProfile.profession || "",
        bio: userProfile.bio || "",
        avatar: userProfile.avatar || "",
      });
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "age") {
      const ageValue = value ? parseInt(value, 10) : "";
      setFormData((prev) => ({ ...prev, [name]: ageValue }));
    } else {
      if (name === "bio" && value.length <= 500) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      } else if (name !== "bio" && value.length >= 0 && value.length <= 50) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      } else if (name === "email" && value.length <= 50) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.middle_name ||
      !formData.age ||
      !formData.profession ||
      !formData.bio
    ) {
      setAlert({
        type: "error",
        message: "Пожалуйста, заполните все обязательные поля.",
      });
      return;
    }

    try {
      const dataToSend = { ...formData };

      if (!(dataToSend.avatar instanceof File)) {
        delete dataToSend.avatar;
      }

      const updatedProfile = await updateProfile(dataToSend);
      if (updatedProfile) {
        setAlert({
          type: "success",
          message: "Профиль успешно обновлен!",
        });

        window.location.reload();
        navigate(`/profile`);
      }
    } catch (error) {
      console.error("Ошибка обновления профиля:", error);
      setAlert({
        type: "error",
        message: "Произошла ошибка при обновлении профиля.",
      });
    }
  };

  if (!profile) return <p>Загрузка...</p>;

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-10 p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-xl rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-3xl font-bold text-white mb-4 text-center">
        Редактировать профиль 🎨
      </h2>
      <div className="flex mb-6 justify-center items-center flex-col">
        {/* Аватар */}
        <motion.img
          src={
            avatarPreview ||
            `http://localhost:8000${formData.avatar}` ||
            "/default-avatar.png"
          }
          alt="Аватар"
          className="w-32 h-32 rounded-full border-4 object-cover border-white shadow-xl mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        />

        {/* Кнопка для выбора файла аватара */}
        <div className="w-full flex justify-center mb-4">
          <label
            htmlFor="avatar"
            className="cursor-pointer text-white font-semibold bg-indigo-600 p-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Выберите файл аватара
          </label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {avatarFileName && (
          <div className="text-white mb-4 text-sm font-semibold">
            Выбран файл: <span className="italic">{avatarFileName}</span>
          </div>
        )}
      </div>

      {alert && <AlertMessage {...alert} onClose={() => setAlert(null)} />}

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Левая колонка: Фамилия, Имя, Отчество */}
          <div>
            <label className="block text-gray-700">
              Имя 👤 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
            <small className="text-gray-500">
              {formData.first_name?.length || 0} / 50
            </small>
          </div>

          <div>
            <label className="block text-gray-700">
              Фамилия 👨‍👩‍👧‍👦 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
            <small className="text-gray-500">
              {formData.last_name?.length || 0} / 50
            </small>
          </div>

          <div>
            <label className="block text-gray-700">
              Отчество 🧑‍🏫 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="middle_name"
              value={formData.middle_name || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
            <small className="text-gray-500">
              {formData.middle_name?.length || 0} / 50
            </small>
          </div>

          {/* Правая колонка: Почта, Профессия, Возраст */}
          <div>
            <label className="block text-gray-700">
              Email 📧 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
            <small className="text-gray-500">
              {formData.email?.length || 0} / 50
            </small>
          </div>

          <div>
            <label className="block text-gray-700">
              Профессия 💼 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="profession"
              value={formData.profession || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
            <small className="text-gray-500">
              {formData.profession?.length || 0} / 50
            </small>
          </div>

          <div>
            <label className="block text-gray-700">
              Возраст 🎂 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              min="1"
              max="120"
              value={formData.age || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
        </div>

        {/* Биография */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <label className="block text-gray-700">
            Биография 📝 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="bio"
            maxLength={500}
            value={formData.bio || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          ></textarea>
          <small className="text-gray-500">
            {formData.bio?.length || 0} / 500
          </small>
        </motion.div>

        {/* Кнопка отправки */}
        <motion.button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
          whileTap={{ scale: 0.95 }}
        >
          Сохранить изменения
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
