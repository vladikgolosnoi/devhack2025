import React, { useState } from "react";
import "./Constructor.css";

const FooterBlockEditor = ({
  block,
  onUpdateField,
  onRemoveBlock,
  onMoveBlockUp,
  onMoveBlockDown,
  onAddTextElement,
  onRemoveTextElement,
  onMoveTextElementUp,
  onMoveTextElementDown,
  onUpdateTextElement,
  onOpenEditor,
}) => {
  const textElements = block.textElements || [];
  const [elementsCollapsed, setElementsCollapsed] = useState(false);

  const handleBackgroundChange = (e) => {
    onUpdateField(block.id, "footerBackground", e.target.value);
  };

  const handleGridColumnsChange = (e) => {
    onUpdateField(block.id, "gridColumns", Number(e.target.value));
  };

  return (
    <div className="footer-block-editor p-6 mb-6 border rounded-lg shadow-lg bg-gradient-to-r from-green-50 to-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-700">Блок "Footer"</h2>
        <div className="space-x-2">
          <button
            onClick={onMoveBlockUp}
            className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
          >
            Вверх
          </button>
          <button
            onClick={onMoveBlockDown}
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Фон футера</label>
            <input
              type="color"
              value={block.footerBackground}
              onChange={handleBackgroundChange}
              className="w-full h-12 rounded border"
            />
          </div>

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

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">Текстовые элементы</h3>
              <button
                onClick={() => setElementsCollapsed(!elementsCollapsed)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
              >
                {elementsCollapsed ? "Развернуть" : "Свернуть"}
              </button>
            </div>
            {!elementsCollapsed ? (
              textElements.length > 0 ? (
                <div className="space-y-4">
                  {textElements.map((el, index) => (
                    <div
                      key={el.id}
                      className="p-4 border rounded bg-white shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Текст:</span>
                        <button
                          onClick={() =>
                            onOpenEditor(block.id, "text", el.text, el.id)
                          }
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                        >
                          Редактировать
                        </button>
                      </div>
                      <div className="mb-2">
                        <label className="block text-sm font-medium">
                          Цвет бокса:
                        </label>
                        <input
                          type="color"
                          value={el.boxColor || "#ffffff"}
                          onChange={(e) =>
                            onUpdateTextElement(
                              el.id,
                              "boxColor",
                              e.target.value
                            )
                          }
                          className="w-16 h-16"
                        />
                      </div>
                      <div className="mb-2 p-2 border rounded bg-gray-50">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: el.text || "Пусто",
                          }}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onMoveTextElementUp(index)}
                          className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
                        >
                          Вверх
                        </button>
                        <button
                          onClick={() => onMoveTextElementDown(index)}
                          className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition text-sm"
                        >
                          Вниз
                        </button>
                        <button
                          onClick={() => onRemoveTextElement(el.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Нет текстовых элементов.</p>
              )
            ) : (
              <div className="text-center py-2 border rounded bg-gray-100">
                Элементы скрыты.
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={onAddTextElement}
              className="w-full px-4 py-3 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              Добавить текстовый элемент
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

export default FooterBlockEditor;
