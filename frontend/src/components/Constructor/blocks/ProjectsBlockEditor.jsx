import React, { useState } from "react";
import "./Constructor.css";

const ProjectsBlockEditor = ({
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
  const projectElements = block.items || [];
  const [elementsCollapsed, setElementsCollapsed] = useState(false);

  return (
    <div className="projects-block-editor p-6 mb-6 border rounded-lg shadow-lg bg-gradient-to-r from-blue-50 to-white">
      {/* Верхняя панель управления */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl sm:text-2xl font-bold text-blue-700 mb-2 sm:mb-0">
          Блок "Проекты, Награды"
        </h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto editor-bottom-bar">
          <button
            onClick={onMoveBlockUp}
            className="w-full sm:w-auto px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
          >
            Вверх
          </button>
          <button
            onClick={onMoveBlockDown}
            className="w-full sm:w-auto px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
          >
            Вниз
          </button>
          <button
            onClick={() => onRemoveBlock(block.id)}
            className="w-full sm:w-auto px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
          >
            Удалить
          </button>
          <button
            onClick={() =>
              onUpdateField(block.id, "collapsed", !block.collapsed)
            }
            className="w-full sm:w-auto px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
          >
            {block.collapsed ? "Открыть" : "Закрыть"}
          </button>
        </div>
      </div>

      {!block.collapsed ? (
        <>
          {/* Редактирование заголовка секции */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
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
            <div className="flex items-center justify-between">
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

          {/* Изменение цвета блока (фон секции) */}
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

          {/* Элементы блока */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl sm:text-xl font-semibold">
                Элементы проекта/награды
              </h3>
              <button
                onClick={() => setElementsCollapsed(!elementsCollapsed)}
                className="w-full sm:w-auto px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
              >
                {elementsCollapsed ? "Развернуть" : "Свернуть"}
              </button>
            </div>
            {!elementsCollapsed ? (
              projectElements.length > 0 ? (
                <div className="space-y-4">
                  {projectElements.map((el, index) => (
                    <div
                      key={el.id}
                      className="p-4 border rounded bg-white shadow-sm"
                      style={{ backgroundColor: el.elementColor || "#ffffff" }}
                    >
                      {/* Редактирование названия */}
                      <div className="mb-2 flex items-center justify-between">
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

                      {/* Редактирование описания */}
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">Описание:</span>
                        <button
                          onClick={() =>
                            onOpenEditor(
                              block.id,
                              "description",
                              el.description,
                              el.id
                            )
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

                      {/* Редактирование URL картинки */}
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">URL картинки:</span>
                        <button
                          onClick={() =>
                            onOpenEditor(block.id, "image", el.image, el.id)
                          }
                          className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-sm"
                        >
                          Редактировать
                        </button>
                      </div>
                      <div className="mb-2">
                        {el.image && el.image.trim() !== "" ? (
                          <div className="p-2 border rounded bg-gray-50">
                            <img
                              src={el.image}
                              alt={el.title}
                              className="w-full h-auto"
                            />
                          </div>
                        ) : (
                          <div className="p-2 border rounded bg-gray-50 text-center text-gray-500">
                            Картинка не указана
                          </div>
                        )}
                      </div>

                      {/* Изменение цвета элемента (фон бокса) */}
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

                      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => onMoveProjectElementUp(index)}
                          className="w-full sm:w-auto px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
                        >
                          Вверх
                        </button>
                        <button
                          onClick={() => onMoveProjectElementDown(index)}
                          className="w-full sm:w-auto px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
                        >
                          Вниз
                        </button>
                        <button
                          onClick={() => onRemoveProjectElement(el.id)}
                          className="w-full sm:w-auto px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Элементы отсутствуют.</p>
              )
            ) : (
              <div className="text-center py-2 border rounded bg-gray-100">
                Элементы скрыты. Нажмите "Развернуть" для просмотра.
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={onAddProjectElement}
              className="w-full px-4 py-3 bg-purple-500 text-white rounded hover:bg-purple-600 transition text-sm"
            >
              Добавить элемент проекта/награды
            </button>
          </div>
          {/* Нижняя панель управления */}
          <div className="editor-bottom-bar mt-6 border-t pt-4">
            <button
              onClick={() => onMoveBlockUp(block.id)}
              className="w-full sm:w-auto px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
            >
              Вверх
            </button>
            <button
              onClick={() => onMoveBlockDown(block.id)}
              className="w-full sm:w-auto px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
            >
              Вниз
            </button>
            <button
              onClick={() => onRemoveBlock(block.id)}
              className="w-full sm:w-auto px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
            >
              Удалить
            </button>
            <button
              onClick={() =>
                onUpdateField(block.id, "collapsed", !block.collapsed)
              }
              className="w-full sm:w-auto px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
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

export default ProjectsBlockEditor;
