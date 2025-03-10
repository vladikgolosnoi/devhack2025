import React, { useState } from "react";
import "./Constructor.css";

const HomeBlockEditor = ({
  block,
  onUpdateField,
  onOpenEditor,
  onRemoveBlock,
  onMoveBlockUp,
  onMoveBlockDown,
  onUpdateItemField,
}) => {
  const items = block.items || [];
  const [itemsCollapsed, setItemsCollapsed] = useState(false);

  return (
    <div className="home-block-editor p-6 mb-6 border rounded-lg shadow-lg bg-gradient-to-r from-blue-50 to-white">
      {/* Верхняя панель управления */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-2 sm:mb-0">
          Блок "Главная"
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

          {/* Редактирование элементов секции */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">Элементы секции</h3>
              <button
                onClick={() => setItemsCollapsed(!itemsCollapsed)}
                className="w-full sm:w-auto px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
              >
                {itemsCollapsed ? "Развернуть" : "Свернуть"}
              </button>
            </div>
            {!itemsCollapsed ? (
              items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border rounded bg-white shadow-sm"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">Название:</span>
                        <button
                          onClick={() =>
                            onOpenEditor(block.id, "title", item.title, item.id)
                          }
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                        >
                          Редактировать
                        </button>
                      </div>
                      <div
                        className="mb-2 p-2 border rounded bg-gray-50"
                        dangerouslySetInnerHTML={{
                          __html: item.title || "Не указано",
                        }}
                      />
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">Описание:</span>
                        <button
                          onClick={() =>
                            onOpenEditor(
                              block.id,
                              "description",
                              item.description,
                              item.id
                            )
                          }
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                        >
                          Редактировать
                        </button>
                      </div>
                      <div
                        className="mb-2 p-2 border rounded bg-gray-50"
                        dangerouslySetInnerHTML={{
                          __html: item.description || "Не указано",
                        }}
                      />
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">URL картинки:</span>
                        <button
                          onClick={() =>
                            onOpenEditor(block.id, "image", item.image, item.id)
                          }
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                        >
                          Редактировать
                        </button>
                      </div>
                      <div className="mb-2">
                        <label className="block text-sm font-medium">
                          Выравнивание картинки:
                        </label>
                        <select
                          value={item.imageAlign || "left"}
                          onChange={(e) =>
                            onUpdateItemField(
                              block.id,
                              item.id,
                              "imageAlign",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border rounded"
                        >
                          <option value="left">Слева</option>
                          <option value="right">Справа</option>
                        </select>
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

          {/* Нижняя панель управления */}
          <div className="editor-bottom-bar flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
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

export default HomeBlockEditor;
