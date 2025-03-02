import React from "react";
import "./Constructor.css";
import { FaVk, FaTelegramPlane, FaEnvelope, FaCrown } from "react-icons/fa";

// Функция для очистки HTML-разметки
const stripHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const PremiumContactsBlockPreview = ({ block }) => {
  // Фон секции берётся как CSS‑градиент
  const sectionStyle = {
    background: block.sectionColor,
  };

  // Функция для выбора иконки соцсети (убран вариант Yandex)
  const getSocialIcon = (socialType) => {
    switch (socialType) {
      case "vk":
        return <FaVk />;
      case "telegram":
        return <FaTelegramPlane />;
      case "gmail":
        return <FaEnvelope />;
      default:
        return null;
    }
  };

  return (
    <div
      className="block-preview-container max-w-4xl mx-auto p-8 sm:p-4 border rounded-lg shadow-xl mb-6"
      style={sectionStyle}
    >
      <h2 className="text-3xl font-bold text-center mb-4">
        {block.sectionTitle} <FaCrown className="inline-block text-yellow-600 ml-1" />
      </h2>
      {block.sectionDescription && (
        <div
          className="text-center mb-6"
          dangerouslySetInnerHTML={{ __html: block.sectionDescription }}
        ></div>
      )}
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: `repeat(${block.gridColumns || 1}, minmax(0, 1fr))`,
        }}
      >
        {block.items &&
          block.items.map((item) => {
            const cleanLink = item.link ? stripHtml(item.link) : "";
            return (
              <div
                key={item.id}
                className="border rounded-lg shadow-md p-4 bg-white hover:shadow-xl transition"
                style={{ backgroundColor: item.elementColor || "#ffffff" }}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">
                    {getSocialIcon(item.socialType)}
                  </span>
                  <h3
                    className="text-xl font-semibold"
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  ></h3>
                </div>
                <div
                  className="mb-2 text-gray-700"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                ></div>
                {cleanLink.trim() !== "" && (
                  <a
                    href={cleanLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Перейти
                  </a>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PremiumContactsBlockPreview;
