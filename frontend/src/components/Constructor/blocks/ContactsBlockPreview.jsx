import React from "react";
import "./Constructor.css";

const ContactsBlockPreview = ({ block }) => {
  // Функция для удаления HTML-тегов из строки
  const stripHtml = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "").trim();
  };

  return (
    <div
      className="block-preview-container max-w-4xl mx-auto p-8 border rounded-lg shadow-xl mb-6"
      style={{ backgroundColor: block.sectionColor }}
    >
      <h2
        className="text-3xl font-bold text-center mb-4"
        dangerouslySetInnerHTML={{ __html: block.sectionTitle }}
      ></h2>
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
            // Очищаем значение ссылки от HTML-тегов
            const cleanLink = item.link ? stripHtml(item.link) : "";
            return (
              <div
                key={item.id}
                className="border rounded-lg shadow-md p-4 bg-white hover:shadow-xl transition"
                style={{ backgroundColor: item.elementColor || "#ffffff" }}
              >
                <div className="flex flex-col h-full">
                  <div>
                    <h3
                      className="text-xl font-semibold mb-2"
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    ></h3>
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

export default ContactsBlockPreview;
