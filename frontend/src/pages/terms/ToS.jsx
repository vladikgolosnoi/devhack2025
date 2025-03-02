import React from "react";
import { Link } from "react-router-dom";

export default function ToS() {
  return (
    <div className="bg-gray-100 text-black p-6 pt-20 flex justify-center min-h-screen">
      <div className="max-w-3xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Условия использования</h1>

        <p className="mb-4">
          Добро пожаловать на платформу <strong>ПреподавательОнлайн</strong>!
          Используя наш сервис, вы соглашаетесь с настоящими условиями. Если вы
          не согласны, пожалуйста, прекратите использование платформы.
        </p>

        <h2 className="text-xl font-semibold mb-2">1. О платформе</h2>
        <p className="mb-4">
        ПреподавательОнлайн — это сервис, предоставляющий преподавателям
          возможность создать персонализированные сайты-портфолио. Платформа
          ориентирована на преподавателей высших и средних учебных заведений,
          репетиторов и научных сотрудников.
        </p>

        <h2 className="text-xl font-semibold mb-2">2. Регистрация и аккаунт</h2>
        <p className="mb-4">
          Регистрация на платформе обязательна для использования основных
          функций. Вы обязуетесь предоставить актуальную и достоверную
          информацию при создании аккаунта. Вы несете полную ответственность за
          сохранность ваших учетных данных.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          3. Контент и управление сайтом
        </h2>
        <p className="mb-4">
          Пользователь может редактировать и управлять содержимым своего сайта,
          включая публикации, награды, проекты и контактную информацию. Мы
          оставляем за собой право удалить или ограничить контент, нарушающий
          законодательство или правила платформы.
        </p>

        <h2 className="text-xl font-semibold mb-2">4. Конфиденциальность</h2>
        <p className="mb-4">
          Все данные, передаваемые через платформу, обрабатываются в
          соответствии с нашей <br></br>
          <Link to="/privacy-policy" className="text-blue-500 underline">
            Политикой конфиденциальности
          </Link>
          .
        </p>

        <h2 className="text-xl font-semibold mb-2">
          5. Ограничение ответственности
        </h2>
        <p className="mb-4">
          Платформа ПреподавательОнлайн не несет ответственности за возможные
          потери данных, сбои в работе сервиса или неправомерное использование
          контента третьими лицами.
        </p>

        <h2 className="text-xl font-semibold mb-2">6. Изменения условий</h2>
        <p className="mb-4">
          Мы оставляем за собой право изменять данные условия в любое время.
          Продолжая пользоваться платформой после обновления условий, вы
          принимаете их.
        </p>

        <p className="mt-4">
          Если у вас есть вопросы, пожалуйста, свяжитесь с нами.
        </p>
      </div>
    </div>
  );
}
