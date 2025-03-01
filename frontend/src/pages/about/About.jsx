import React from "react";

const About = () => {
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out both;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out both;
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 1s ease-out both;
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-600 { animation-delay: 0.6s; }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        <section className="relative bg-gradient-to-r from-purple-600 to-pink-500 min-h-[500px] flex items-center justify-center pt-20 animate-fadeInUp">
          <div className="relative text-center text-white max-w-2xl px-4">
            <h1 className="text-5xl font-bold mb-4">
              ПреподОнлайн: создавайте сайты‑визитки легко
            </h1>
            <p className="text-xl mb-6">
              Присоединяйтесь к сотням преподавателей, которые уже делают
              обучение доступнее и эффективнее.
            </p>
            <a
              href="/auth"
              className="bg-white text-gray-800 py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105 hover:bg-gray-200 duration-300 animate-pulse"
            >
              Начать сейчас
            </a>
          </div>
        </section>
        <div className="container mx-auto px-4 py-20 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl p-10">
            <h2 className="text-3xl font-bold text-black mb-6">
              О нашей платформе
            </h2>
            <div className="mb-6 border-b pb-6 border-gray-200 animate-fadeInUp">
              <h3 className="text-2xl font-semibold mb-3">Наша миссия</h3>
              <p className="text-gray-700 leading-relaxed">
                Мы создали <strong>ПреподОнлайн</strong>, чтобы дать возможность
                каждому онлайн-преподавателю выделиться в цифровом пространстве.
                Наша платформа помогает вам сосредоточиться на главном —
                обучении, а все технические вопросы мы берём на себя. Мы
                стремимся к инновациям, упрощению и максимальной эффективности в
                образовательном процессе.
              </p>
            </div>
            <div className="mb-6 animate-fadeInUp delay-200">
              <h3 className="text-2xl font-semibold mb-3">Как это работает?</h3>
              <ul className="list-disc ml-6 text-gray-700 leading-relaxed mb-4">
                <li>
                  <strong>Регистрация:</strong> создайте аккаунт, чтобы получить
                  доступ к конструктору.
                </li>
                <li>
                  <strong>Выбор шаблона:</strong> начните с чистого листа или
                  выберите один из готовых дизайнов.
                </li>
                <li>
                  <strong>Настройка:</strong> добавьте тексты, фотографии, цены
                  и контактные данные. Сайт готов!
                </li>
              </ul>
            </div>
            <div className="mb-6 animate-fadeInUp delay-400">
              <h3 className="text-2xl font-semibold mb-3">
                Почему ПреподОнлайн?
              </h3>
              <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
                <li>
                  <strong>Адаптивный дизайн:</strong> ваши материалы будут
                  отлично смотреться на любом устройстве.
                </li>
                <li>
                  <strong>Удобный конструктор:</strong> создавайте сайт без
                  знаний программирования.
                </li>
                <li>
                  <strong>Профессиональные шаблоны:</strong> под любые предметы
                  — от языков до точных наук.
                </li>
              </ul>
            </div>
            <div className="text-center mt-10 animate-fadeInUp delay-600">
              <a
                href="/sites"
                className="inline-block bg-gray-800 text-white py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105 hover:bg-gray-700 duration-300"
              >
                Создать свой сайт
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
