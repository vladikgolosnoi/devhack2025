import React, { useState } from "react";
import "./Constructor.css";

// Если у вас уже есть функция очистки HTML, можно её импортировать или определить здесь:
const stripHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const ContactsBlockEditor = ({
  block,
  onUpdateField,
  onRemoveBlock,
  onMoveBlockUp,
  onMoveBlockDown,
  onAddProjectElement, // переиспользуем для добавления нового контакта
  onRemoveProjectElement, // аналогичная логика удаления
  onMoveProjectElementUp,
  onMoveProjectElementDown,
  onUpdateProjectElement,
  onOpenEditor,
}) => {
  const contactElements = block.items || [];
  const [elementsCollapsed, setElementsCollapsed] = useState(false);

  return (
    <div className="contacts-block-editor p-6 mb-6 border rounded-lg shadow-lg bg-gradient-to-r from-purple-50 to-white">
      {/* Верхняя панель управления */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-purple-700">Блок "Контакты"</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto editor-bottom-bar ">
          <button
            onClick={() => onMoveBlockUp(block.id)}
            className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
          >
            Вверх
          </button>
          <button
            onClick={() => onMoveBlockDown(block.id)}
            className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
          >
            Вниз
          </button>
          <button
            onClick={() => onRemoveBlock(block.id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
          >
            Удалить
          </button>
          <button
            onClick={() =>
              onUpdateField(block.id, "collapsed", !block.collapsed)
            }
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
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
                onClick={() =>
                  onOpenEditor(block.id, "sectionTitle", block.sectionTitle)
                }
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
              >
                Редактировать
              </button>
            </div>
            <div
              className="mt-1 p-2 border rounded bg-white"
              dangerouslySetInnerHTML={{
                __html: block.sectionTitle || "Не указано",
              }}
            />
          </div>

          {/* Редактирование описания секции */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center justify-between">
              <span className="font-medium text-lg">Описание секции:</span>
              <button
                onClick={() =>
                  onOpenEditor(
                    block.id,
                    "sectionDescription",
                    block.sectionDescription
                  )
                }
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
              >
                Редактировать
              </button>
            </div>
            <div
              className="mt-1 p-2 border rounded bg-white"
              dangerouslySetInnerHTML={{
                __html: block.sectionDescription || "Не указано",
              }}
            />
          </div>

          {/* Изменение цвета секции */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Фон секции:
            </label>
            <input
              type="color"
              value={block.sectionColor}
              onChange={(e) =>
                onUpdateField(block.id, "sectionColor", e.target.value)
              }
              className="w-full h-12 rounded border"
            />
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
              onChange={(e) =>
                onUpdateField(block.id, "gridColumns", Number(e.target.value))
              }
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
              contactElements.length > 0 ? (
                <div className="space-y-4">
                  {contactElements.map((el, index) => (
                    <div
                      key={el.id}
                      className="p-4 border rounded bg-white shadow-sm overflow-hidden"
                      style={{ backgroundColor: el.elementColor || "#ffffff" }}
                    >
                      {/* Редактирование названия контакта */}
                      <div className="mb-2 flex flex-wrap items-center justify-between">
                        <span className="font-medium">Название:</span>
                        <button
                          onClick={() =>
                            onOpenEditor(block.id, "title", el.title, el.id)
                          }
                          className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-sm"
                        >
                          Редактировать
                        </button>
                      </div>
                      <div
                        className="mb-2 p-2 border rounded bg-gray-50"
                        dangerouslySetInnerHTML={{
                          __html: el.title || "Не указано",
                        }}
                      />

                      {/* Редактирование описания контакта */}
                      <div className="mb-2 flex flex-wrap items-center justify-between">
                        <span className="font-medium">Описание:</span>
                        <button
                          onClick={() =>
                            onOpenEditor(block.id, "description", el.description, el.id)
                          }
                          className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-sm"
                        >
                          Редактировать
                        </button>
                      </div>
                      <div
                        className="mb-2 p-2 border rounded bg-gray-50"
                        dangerouslySetInnerHTML={{
                          __html: el.description || "Не указано",
                        }}
                      />

                      {/* Редактирование ссылки контакта */}
                      <div className="mb-2 flex flex-wrap items-center justify-between">
                        <span className="font-medium">Ссылка:</span>
                        <button
                          onClick={() =>
                            onOpenEditor(block.id, "link", el.link, el.id)
                          }
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

                      {/* Изменение фона элемента (цвет бокса) */}
                      <div className="mb-2">
                        <label className="block text-sm font-medium">
                          Фон элемента:
                        </label>
                        <input
                          type="color"
                          value={el.elementColor || "#ffffff"}
                          onChange={(e) =>
                            onUpdateProjectElement(
                              el.id,
                              "elementColor",
                              e.target.value
                            )
                          }
                          className="w-16 h-16 rounded border"
                        />
                      </div>

                      {/* Верхние управляющие кнопки для элемента */}
                      <div className="flex justify-end space-x-2">
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
              )
            ) : (
              <div className="text-center py-2 border rounded bg-gray-100">
                Элементы скрыты. Нажмите "Развернуть" для просмотра.
              </div>
            )}
          </div>

          {/* Дополнительная панель управления внизу блока */}
          <div className="flex flex-wrap justify-evenly mt-4 border-t pt-4">
            <button
              onClick={() => onMoveBlockUp(block.id)}
              className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm w-full sm:w-auto mb-2 sm:mb-0"
            >
              Вверх
            </button>
            <button
              onClick={() => onMoveBlockDown(block.id)}
              className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm w-full sm:w-auto mb-2 sm:mb-0"
            >
              Вниз
            </button>
            <button
              onClick={() => onRemoveBlock(block.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm w-full sm:w-auto mb-2 sm:mb-0"
            >
              Удалить
            </button>
            <button
              onClick={() =>
                onUpdateField(block.id, "collapsed", !block.collapsed)
              }
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm w-full sm:w-auto"
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

export default ContactsBlockEditor;
