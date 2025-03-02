import React from "react";
import "./Constructor.css";
import { FaVk, FaTelegramPlane, FaEnvelope, FaCrown } from "react-icons/fa";

// Функция для удаления HTML-тегов из строки
const stripHtml = (html) => {
  return html.replace(/<\/?[^>]+(>|$)/g, "").trim();
};

const PremiumContactsBlockPreview = ({ block }) => {
  // Функция для выбора иконки соцсети
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
      className="block-preview-container max-w-4xl mx-auto p-8 border rounded-lg shadow-xl mb-6"
      style={{ backgroundColor: block.sectionColor }}
    >
      <h2 className="text-3xl font-bold text-center mb-4">
        <span dangerouslySetInnerHTML={{ __html: block.sectionTitle }} />
        <FaCrown className="inline-block text-yellow-600 ml-1" />
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
                <div className="flex flex-col h-full">
                  <div>
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
                      style={{ backgroundColor: "transparent" }}
                    ></div>
                  </div>
                  {cleanLink && (
                    <div className="mt-auto">
                      {cleanLink.startsWith("mailto:") ? (
                        <a
                          href={cleanLink}
                          className="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          Перейти
                        </a>
                      ) : (
                        <a
                          href={cleanLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          Перейти
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PremiumContactsBlockPreview;
