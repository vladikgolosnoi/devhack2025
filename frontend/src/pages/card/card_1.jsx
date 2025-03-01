import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TeacherProfileEditor() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  const [theme, setTheme] = useState({
    background: "#1f2937",
    text: "#ffffff",
    accent: "#2563eb",
    font: "sans-serif",
    textSize: 16,
    topBackground: "#2563eb"
  });

  const [teacher, setTeacher] = useState({
    name: "Иван Петров",
    subject: "Математика",
    bio: "Опытный преподаватель с 10-летним стажем, который вдохновляет студентов и помогает им достигать успехов.",
    image:
      "https://avatars.mds.yandex.net/i?id=21031d2540a3c65cd9ce930519714ab2f40ff671-4901375-images-thumbs&n=13",
    experience: "10 лет",
    education: "МГУ, Факультет математики",
    philosophy: "Моя цель – вдохновлять студентов на новые достижения.",
    methodology: "Использую современные технологии и индивидуальный подход к каждому ученику.",
    achievements: "Лучший преподаватель года, победитель образовательных конкурсов",
    awards: "Премия за инновационные методики, диплом 'Учитель года'",
    email: "ivan.petrov@email.com",
    phone: "+7 900 123 45 67",
    projects: "Онлайн-курс по алгебре, вебинары по подготовке к экзаменам",
    publications: "Автор книги 'Современная математика', статьи в научных журналах",
    reviews: "Отличный преподаватель! 5/5, замечательный подход к обучению",
    social: "https://twitter.com/ivanpetrov"
  });

  // Обработка изменений полей учителя
  const handleChange = (e) => {
    setTeacher({ ...teacher, [e.target.name]: e.target.value });
  };

  // Обработка изменений темы
  const handleThemeChange = (e) => {
    const { name, value } = e.target;
    setTheme({
      ...theme,
      [name]: name === "textSize" ? parseInt(value) || 16 : value
    });
  };

  // Генерация ссылки (при желании можно использовать params)
  const generateLink = () => {
    const uniqueId = new Date().getTime().toString();
    const profileHTML = document.querySelector(".copy_html").outerHTML;
    localStorage.setItem(uniqueId, profileHTML);

    const link = `${window.location.origin}/profile/${uniqueId}`;
    setGeneratedLink(link);
    setShowModal(true);
  };

  // Предпросмотр профиля в новом окне
  const previewProfile = () => {
    const headContent = document.head.innerHTML;
    const profileHTML = document.querySelector(".copy_html").outerHTML;

    const previewWindow = window.open("", "preview");
    previewWindow.document.write(`
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${headContent}
          <style>
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
            }
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: ${theme.background};
              min-width: 320px;
              min-height: 100vh;
            }
            .copy_html {
              max-width: 900px;
              width: 100%;
              margin: auto;
              box-shadow: 0 0 20px rgba(0,0,0,0.3);
              border-radius: 20px;
              background-color: #ffffff; /* фон карточки */
            }
          </style>
        </head>
        <body>
          ${profileHTML}
        </body>
      </html>
    `);
    previewWindow.document.close();
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row p-6 gap-6 transition-colors duration-500"
      style={{
        fontFamily: theme.font,
        backgroundColor: theme.background
      }}
    >
      {/* Кнопка открытия/закрытия сайдбара */}
      <button
        className="absolute left-2 top-2 bg-blue-600 text-white p-2 rounded-full shadow-xl z-10 transition hover:bg-blue-700"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {/* Сайдбар редактора */}
      <div
        className={`bg-white p-6 rounded-2xl shadow-xl w-full md:w-1/3 transition-all duration-300 ${
          isMenuOpen ? "block" : "hidden md:block md:w-16 overflow-hidden"
        }`}
      >
        {isMenuOpen && (
          <>
            <h2 className="text-2xl font-extrabold mb-4 text-blue-600">
              Редактор
            </h2>
            <button
              className="w-full bg-blue-500 text-white p-3 rounded-lg mb-6 transition hover:bg-blue-600"
              onClick={generateLink}
            >
              Получить ссылку
            </button>

            {/* Настройки темы */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Настройки темы</h3>
              <label className="block text-sm font-medium text-gray-700">
                Фон
              </label>
              <input
                type="color"
                name="background"
                value={theme.background}
                onChange={handleThemeChange}
                className="w-full border p-2 rounded mb-2"
              />
              <label className="block text-sm font-medium text-gray-700">
                Текст
              </label>
              <input
                type="color"
                name="text"
                value={theme.text}
                onChange={handleThemeChange}
                className="w-full border p-2 rounded mb-2"
              />
              <label className="block text-sm font-medium text-gray-700">
                Акцент
              </label>
              <input
                type="color"
                name="accent"
                value={theme.accent}
                onChange={handleThemeChange}
                className="w-full border p-2 rounded mb-2"
              />
              <label className="block text-sm font-medium text-gray-700">
                Верхний фон
              </label>
              <input
                type="color"
                name="topBackground"
                value={theme.topBackground}
                onChange={handleThemeChange}
                className="w-full border p-2 rounded mb-2"
              />
              <label className="block text-sm font-medium text-gray-700">
                Размер текста (px)
              </label>
              <input
                type="number"
                name="textSize"
                value={theme.textSize}
                onChange={handleThemeChange}
                className="w-full border p-2 rounded mb-2"
              />
            </div>

            {/* Основные данные */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Основные данные</h3>
              <input
                type="text"
                name="name"
                value={teacher.name}
                onChange={handleChange}
                placeholder="Имя"
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                name="subject"
                value={teacher.subject}
                onChange={handleChange}
                placeholder="Предмет"
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                name="image"
                value={teacher.image}
                onChange={handleChange}
                placeholder="Ссылка на изображение"
                className="w-full border p-2 rounded mb-2"
              />
              <textarea
                name="bio"
                value={teacher.bio}
                onChange={handleChange}
                placeholder="Биография"
                className="w-full border p-2 rounded mb-2"
                rows="3"
              />
            </div>

            {/* Опыт и образование */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Опыт и образование</h3>
              <input
                type="text"
                name="experience"
                value={teacher.experience}
                onChange={handleChange}
                placeholder="Опыт"
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                name="education"
                value={teacher.education}
                onChange={handleChange}
                placeholder="Образование"
                className="w-full border p-2 rounded mb-2"
              />
            </div>

            {/* Философия и методика */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Философия и методика</h3>
              <input
                type="text"
                name="philosophy"
                value={teacher.philosophy}
                onChange={handleChange}
                placeholder="Философия"
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                name="methodology"
                value={teacher.methodology}
                onChange={handleChange}
                placeholder="Методика"
                className="w-full border p-2 rounded mb-2"
              />
            </div>

            {/* Достижения, проекты, награды, публикации */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Достижения, проекты, награды, публикации
              </h3>
              <input
                type="text"
                name="achievements"
                value={teacher.achievements}
                onChange={handleChange}
                placeholder="Достижения"
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                name="projects"
                value={teacher.projects}
                onChange={handleChange}
                placeholder="Проекты"
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                name="awards"
                value={teacher.awards}
                onChange={handleChange}
                placeholder="Награды"
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                name="publications"
                value={teacher.publications}
                onChange={handleChange}
                placeholder="Публикации"
                className="w-full border p-2 rounded mb-2"
              />
            </div>

            {/* Отзывы */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Отзывы</h3>
              <input
                type="text"
                name="reviews"
                value={teacher.reviews}
                onChange={handleChange}
                placeholder="Отзывы"
                className="w-full border p-2 rounded mb-2"
              />
            </div>

            {/* Контакты и соцсети */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Контакты и соцсети
              </h3>
              <input
                type="text"
                name="email"
                value={teacher.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                name="phone"
                value={teacher.phone}
                onChange={handleChange}
                placeholder="Телефон"
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                name="social"
                value={teacher.social}
                onChange={handleChange}
                placeholder="Ссылка на соцсеть"
                className="w-full border p-2 rounded mb-2"
              />
            </div>
          </>
        )}
      </div>

      {/* Карточка профиля */}
      <div
        className="p-8 flex flex-col transition-transform duration-300 copy_html"
        style={{
          // Белый фон карточки (чтобы выделялась на тёмном фоне страницы):
          backgroundColor: "#ffffff",
          color: theme.text,
          fontFamily: theme.font,
          fontSize: theme.textSize + "px",
          borderRadius: "1rem",
          boxShadow: "0 0 20px rgba(0,0,0,0.2)",
          maxWidth: "900px",
          width: "100%",
          margin: "auto"
        }}
      >
        <header
          className="text-center py-10 w-full rounded-t-2xl shadow-md"
          style={{
            background: theme.topBackground,
            color: "white",
            fontSize: theme.textSize * 3 + "px"
          }}
        >
          {teacher.image && (
            <img
              src={teacher.image}
              alt={teacher.name}
              className="w-40 h-40 mx-auto rounded-full border-4 border-white shadow-xl"
            />
          )}
          <h1
            className="font-extrabold mt-4"
            style={{ fontSize: theme.textSize * 3 + "px" }}
          >
            {teacher.name}
          </h1>
          <p
            className="italic"
            style={{ fontSize: theme.textSize * 1.25 + "px" }}
          >
            {teacher.subject}
          </p>
        </header>

        <section className="p-6 w-full space-y-6">
          {/* Биография */}
          <div className="space-y-2">
            <h2
              className="font-bold"
              style={{ color: theme.accent, fontSize: theme.textSize * 2 + "px" }}
            >
              Биография
            </h2>
            <p>{teacher.bio}</p>
          </div>

          {/* Опыт и образование */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="p-4 border border-dashed rounded-lg transition transform hover:scale-105"
              style={{ borderColor: theme.accent }}
            >
              <h3
                className="font-semibold"
                style={{
                  color: theme.accent,
                  fontSize: theme.textSize * 1.5 + "px"
                }}
              >
                Опыт
              </h3>
              <p>{teacher.experience}</p>
            </div>
            <div
              className="p-4 border border-dashed rounded-lg transition transform hover:scale-105"
              style={{ borderColor: theme.accent }}
            >
              <h3
                className="font-semibold"
                style={{
                  color: theme.accent,
                  fontSize: theme.textSize * 1.5 + "px"
                }}
              >
                Образование
              </h3>
              <p>{teacher.education}</p>
            </div>
          </div>

          {/* Философия преподавания */}
          <div
            className="p-4 border border-dashed rounded-lg transition transform hover:scale-105"
            style={{ borderColor: theme.accent }}
          >
            <h3
              className="font-semibold"
              style={{
                color: theme.accent,
                fontSize: theme.textSize * 1.5 + "px"
              }}
            >
              Философия преподавания
            </h3>
            <p>{teacher.philosophy}</p>
          </div>

          {/* Методология */}
          <div
            className="p-4 border border-dashed rounded-lg transition transform hover:scale-105"
            style={{ borderColor: theme.accent }}
          >
            <h3
              className="font-semibold"
              style={{
                color: theme.accent,
                fontSize: theme.textSize * 1.5 + "px"
              }}
            >
              Методология
            </h3>
            <p>{teacher.methodology}</p>
          </div>

          {/* Достижения, проекты, награды, публикации */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div
              className="p-4 border border-dashed rounded-lg transition transform hover:scale-105"
              style={{ borderColor: theme.accent }}
            >
              <h3
                className="font-semibold"
                style={{
                  color: theme.accent,
                  fontSize: theme.textSize * 1.5 + "px"
                }}
              >
                Достижения
              </h3>
              <p>{teacher.achievements}</p>
            </div>
            <div
              className="p-4 border border-dashed rounded-lg transition transform hover:scale-105"
              style={{ borderColor: theme.accent }}
            >
              <h3
                className="font-semibold"
                style={{
                  color: theme.accent,
                  fontSize: theme.textSize * 1.5 + "px"
                }}
              >
                Проекты
              </h3>
              <p>{teacher.projects}</p>
            </div>
            <div
              className="p-4 border border-dashed rounded-lg transition transform hover:scale-105"
              style={{ borderColor: theme.accent }}
            >
              <h3
                className="font-semibold"
                style={{
                  color: theme.accent,
                  fontSize: theme.textSize * 1.5 + "px"
                }}
              >
                Награды
              </h3>
              <p>{teacher.awards}</p>
            </div>
            <div
              className="p-4 border border-dashed rounded-lg transition transform hover:scale-105"
              style={{ borderColor: theme.accent }}
            >
              <h3
                className="font-semibold"
                style={{
                  color: theme.accent,
                  fontSize: theme.textSize * 1.5 + "px"
                }}
              >
                Публикации
              </h3>
              <p>{teacher.publications}</p>
            </div>
          </div>

          {/* Отзывы */}
          <div
            className="p-4 border border-dashed rounded-lg transition transform hover:scale-105"
            style={{ borderColor: theme.accent }}
          >
            <h3
              className="font-semibold"
              style={{
                color: theme.accent,
                fontSize: theme.textSize * 1.5 + "px"
              }}
            >
              Отзывы
            </h3>
            <p>{teacher.reviews}</p>
          </div>

          {/* Контакты и соцсети */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="p-4 border border-dashed rounded-lg transition transform hover:scale-105"
              style={{ borderColor: theme.accent }}
            >
              <h3
                className="font-semibold"
                style={{
                  color: theme.accent,
                  fontSize: theme.textSize * 1.5 + "px"
                }}
              >
                Контакты
              </h3>
              <p>
                {teacher.email}
                <br />
                {teacher.phone}
              </p>
            </div>
            <div
              className="p-4 border border-dashed rounded-lg transition transform hover:scale-105"
              style={{ borderColor: theme.accent }}
            >
              <h3
                className="font-semibold"
                style={{
                  color: theme.accent,
                  fontSize: theme.textSize * 1.5 + "px"
                }}
              >
                Соцсети
              </h3>
              <p className="text-lg">
                <a
                  href={teacher.social}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {teacher.social}
                </a>
              </p>
            </div>
          </div>
        </section>

        <footer
          className="w-full mt-8 py-4 rounded-b-2xl text-white text-center"
          style={{
            backgroundColor: theme.topBackground,
            fontSize: theme.textSize + "px"
          }}
        >
          <p className="font-semibold">&copy; 2025 Все права защищены.</p>
        </footer>
      </div>

      {/* Модальное окно со ссылкой */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Ссылка на ваш профиль
            </h2>
            <input
              type="text"
              value={generatedLink}
              readOnly
              className="w-full border p-3 rounded mb-4"
            />
            <button
              className="w-full bg-green-500 text-white p-3 rounded mb-4 hover:bg-green-600 transition"
              onClick={previewProfile}
            >
              Предпоказ
            </button>
            <button
              className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
              onClick={() => {
                navigator.clipboard.writeText(generatedLink);
                setShowModal(false);
              }}
            >
              Скопировать ссылку
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
