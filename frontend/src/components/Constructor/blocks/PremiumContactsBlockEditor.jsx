import React, { useState, useEffect } from "react";
import { FaCrown, FaVk, FaTelegramPlane, FaEnvelope } from "react-icons/fa";
import "./Constructor.css";

// Функция для очистки HTML-разметки
const stripHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const PremiumContactsBlockEditor = ({
  block,
  onUpdateField,
  onRemoveBlock,
  onMoveBlockUp,
  onMoveBlockDown,
  onAddProjectElement,
  onRemoveProjectElement,
  onMoveProjectElementUp,
  onMoveProjectElementDown,
  onUpdateProjectElement,
  onOpenEditor,
}) => {
  const contactElements = block.items || [];
  const [elementsCollapsed, setElementsCollapsed] = useState(false);

  // Локальные состояния для градиента
  const [localGradientStart, setLocalGradientStart] = useState(block.gradientStart || "#ffd700");
  const [localGradientEnd, setLocalGradientEnd] = useState(block.gradientEnd || "#ffb700");

  useEffect(() => {
    if (
      block.gradientStart !== localGradientStart ||
      block.gradientEnd !== localGradientEnd
    ) {
      onUpdateField(block.id, "gradientStart", localGradientStart);
      onUpdateField(block.id, "gradientEnd", localGradientEnd);
      onUpdateField(
        block.id,
        "sectionColor",
        `linear-gradient(to right, ${localGradientStart}, ${localGradientEnd})`
      );
    }
  }, [localGradientStart, localGradientEnd]);


  const handleGradientStartChange = (e) => {
    setLocalGradientStart(e.target.value);
  };

  const handleGradientEndChange = (e) => {
    setLocalGradientEnd(e.target.value);
  };

  const handleGridColumnsChange = (e) => {
    onUpdateField(block.id, "gridColumns", Number(e.target.value));
  };

  // Функция для добавления нового контакта
  const handleAddContactElement = () => {
    const newContact = {
      id: Date.now(), // генерируем простой уникальный id
      title: "",
      description: "",
      link: "",
      socialType: "vk",
      elementColor: "#ffffff",
    };
    onAddProjectElement(block.id, newContact);
  };

  return (
    <div className="premium-contacts-block-editor p-6 sm:p-4 mb-6 border rounded-lg shadow-lg bg-gradient-to-r from-gold-50 to-gold-100">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-800">
          Премиум Контакты <FaCrown className="inline-block text-yellow-600 ml-1" />
        </h2>
        <div className="space-x-2 editor-bottom-bar mt-2 sm:mt-0">
          <button
            onClick={onMoveBlockUp}
            className="px-3 py-1 w-full sm:w-auto bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
          >
            Вверх
          </button>
          <button
            onClick={onMoveBlockDown}
            className="px-3 py-1 w-full sm:w-auto bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
          >
            Вниз
          </button>
          <button
            onClick={() => onRemoveBlock(block.id)}
            className="px-3 py-1 w-full sm:w-auto bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
          >
            Удалить
          </button>
          <button
            onClick={() => onUpdateField(block.id, "collapsed", !block.collapsed)}
            className="px-3 py-1 w-full sm:w-auto bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
          >
            {block.collapsed ? "Открыть" : "Закрыть"}
          </button>
        </div>
      </div>

      {!block.collapsed ? (
        <>
          {/* Редактирование заголовка секции */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center justify-between">
              <span className="font-medium text-lg">Заголовок секции:</span>
              <button
                onClick={() => onOpenEditor(block.id, "sectionTitle", block.sectionTitle)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
              >
                Редактировать
              </button>
            </div>
            <div
              className="mt-1 p-2 border rounded bg-white"
              dangerouslySetInnerHTML={{ __html: block.sectionTitle || "Не указано" }}
            />
          </div>

          {/* Редактирование описания секции */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center justify-between">
              <span className="font-medium text-lg">Описание секции:</span>
              <button
                onClick={() => onOpenEditor(block.id, "sectionDescription", block.sectionDescription)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
              >
                Редактировать
              </button>
            </div>
            <div
              className="mt-1 p-2 border rounded bg-white"
              dangerouslySetInnerHTML={{ __html: block.sectionDescription || "Не указано" }}
            />
          </div>

          {/* Редактирование градиентного фона секции */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Градиентный фон секции:
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={localGradientStart}
                onChange={handleGradientStartChange}
                className="w-16 h-16 rounded border"
              />
              <input
                type="color"
                value={localGradientEnd}
                onChange={handleGradientEndChange}
                className="w-16 h-16 rounded border"
              />
            </div>
          </div>

          {/* Количество колонок */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Количество колонок (Grid):
            </label>
            <input
              type="number"
              min="1"
              max="4"
              value={block.gridColumns || 1}
              onChange={handleGridColumnsChange}
              className="w-full px-2 py-1 border rounded"
            />
          </div>

          {/* Редактирование элементов контактов */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">Контактные данные</h3>
              <button
                onClick={() => setElementsCollapsed(!elementsCollapsed)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
              >
                {elementsCollapsed ? "Развернуть" : "Свернуть"}
              </button>
            </div>
            {!elementsCollapsed ? (
              <>
                {contactElements.length > 0 ? (
                  <div className="space-y-4">
                    {contactElements.map((el, index) => (
                      <div
                        key={el.id}
                        className="p-4 border rounded bg-white shadow-sm"
                        style={{ backgroundColor: el.elementColor || "#ffffff" }}
                      >
                        {/* Редактирование названия */}
                        <div className="mb-2 flex flex-wrap items-center justify-between">
                          <span className="font-medium">Название:</span>
                          <button
                            onClick={() => onOpenEditor(block.id, "title", el.title, el.id)}
                            className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-sm"
                          >
                            Редактировать
                          </button>
                        </div>
                        <div
                          className="mb-2 p-2 border rounded bg-gray-50"
                          dangerouslySetInnerHTML={{ __html: el.title || "Не указано" }}
                        />

                        {/* Редактирование описания */}
                        <div className="mb-2 flex flex-wrap items-center justify-between">
                          <span className="font-medium">Описание:</span>
                          <button
                            onClick={() => onOpenEditor(block.id, "description", el.description, el.id)}
                            className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-sm"
                          >
                            Редактировать
                          </button>
                        </div>
                        <div
                          className="mb-2 p-2 border rounded bg-gray-50"
                          dangerouslySetInnerHTML={{ __html: el.description || "Не указано" }}
                        />

                        {/* Редактирование ссылки */}
                        <div className="mb-2 flex flex-wrap items-center justify-between">
                          <span className="font-medium">Ссылка:</span>
                          <button
                            onClick={() => onOpenEditor(block.id, "link", el.link, el.id)}
                            className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-sm"
                          >
                            Редактировать
                          </button>
                        </div>
                        <div className="mb-2 p-2 border rounded bg-gray-50">
                          {el.link && stripHtml(el.link).trim() !== "" ? (
                            <a
                              href={stripHtml(el.link)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline break-words"
                            >
                              {stripHtml(el.link)}
                            </a>
                          ) : (
                            "Ссылка не указана"
                          )}
                        </div>

                        {/* Выбор соцсети */}
                        <div className="mb-2">
                          <label className="block text-sm font-medium mb-1">
                            Выберите соцсеть:
                          </label>
                          <select
                            value={el.socialType || "vk"}
                            onChange={(e) =>
                              onUpdateProjectElement(el.id, "socialType", e.target.value)
                            }
                            className="w-full px-2 py-1 border rounded"
                          >
                            <option value="vk">VK</option>
                            <option value="telegram">Telegram</option>
                            <option value="gmail">Gmail</option>
                          </select>
                        </div>

                        {/* Изменение фона элемента */}
                        <div className="mb-2">
                          <label className="block text-sm font-medium">
                            Фон элемента:
                          </label>
                          <input
                            type="color"
                            value={el.elementColor || "#ffffff"}
                            onChange={(e) =>
                              onUpdateProjectElement(el.id, "elementColor", e.target.value)
                            }
                            className="w-16 h-16 rounded border"
                          />
                        </div>

                        {/* Управляющие кнопки для элемента */}
                        <div className="flex flex-wrap justify-end space-x-2">
                          <button
                            onClick={() => onMoveProjectElementUp(index)}
                            className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
                          >
                            Вверх
                          </button>
                          <button
                            onClick={() => onMoveProjectElementDown(index)}
                            className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
                          >
                            Вниз
                          </button>
                          <button
                            onClick={() => onRemoveProjectElement(el.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Контактные данные отсутствуют.</p>
                )}
                {/* Кнопка для добавления нового контакта */}
                <button
                  onClick={handleAddContactElement}
                  className="mt-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                >
                  Добавить контакт
                </button>
              </>
            ) : (
              <div className="text-center py-2 border rounded bg-gray-100">
                Элементы скрыты. Нажмите "Развернуть" для просмотра.
              </div>
            )}
          </div>

          <div className="editor-bottom-bar">
            <button
              onClick={() => onMoveBlockUp(block.id)}
              className="px-3 py-1 w-full sm:w-auto bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
            >
              Вверх
            </button>
            <button
              onClick={() => onMoveBlockDown(block.id)}
              className="px-3 py-1 w-full sm:w-auto bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
            >
              Вниз
            </button>
            <button
              onClick={() => onRemoveBlock(block.id)}
              className="px-3 py-1 w-full sm:w-auto bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
            >
              Удалить
            </button>
            <button
              onClick={() => onUpdateField(block.id, "collapsed", !block.collapsed)}
              className="px-3 py-1 w-full sm:w-auto bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
            >
              {block.collapsed ? "Открыть" : "Закрыть"}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-4 border rounded bg-gray-100">
          Секция закрыта. Нажмите "Открыть" для просмотра.
        </div>
      )}
    </div>
  );
};

export default PremiumContactsBlockEditor;
