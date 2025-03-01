import React from "react";

const TextEditorModel = ({
  editorModal,
  handleSaveEditor,
  handleCancelEditor,
  showLinkBar,
  setShowLinkBar,
  linkUrl,
  setLinkUrl,
  savedRange,
  setSavedRange,
  showAlignDropdown,
  setShowAlignDropdown,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto">
      <div className="bg-white p-8 rounded shadow-lg w-11/12 max-w-2xl max-h-screen overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            Редактировать {editorModal.field}
          </h3>
          <button
            onClick={handleCancelEditor}
            className="text-gray-500 text-2xl"
          >
            &times;
          </button>
        </div>
        {editorModal.field === "image" ? (
          <div>
            <label className="block text-sm font-medium mb-2">
              Введите URL картинки
            </label>
            <input
              type="url"
              defaultValue={editorModal.initialValue}
              id="imageURL"
              className="w-full border p-2 rounded"
            />
          </div>
        ) : (
          <>
            <div className="bg-gray-200 p-2 rounded mb-2">
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  onClick={() => {
                    const editor = document.getElementById("editorContent");
                    if (editor) editor.focus();
                    document.execCommand("bold", false, null);
                  }}
                  className="p-1 border rounded font-bold"
                >
                  B
                </button>
                <button
                  onClick={() => {
                    const editor = document.getElementById("editorContent");
                    if (editor) editor.focus();
                    document.execCommand("italic", false, null);
                  }}
                  className="p-1 border rounded italic"
                >
                  I
                </button>
                <button
                  onClick={() => {
                    const editor = document.getElementById("editorContent");
                    if (editor) editor.focus();
                    document.execCommand("underline", false, null);
                  }}
                  className="p-1 border rounded underline"
                >
                  U
                </button>
                <select
                  className="p-1 border rounded"
                  onChange={(e) => {
                    const editor = document.getElementById("editorContent");
                    if (editor) editor.focus();
                    document.execCommand("fontSize", false, e.target.value);
                  }}
                >
                  <option value="">Размер шрифта</option>
                  <option value="1">Очень маленький</option>
                  <option value="2">Маленький</option>
                  <option value="3">Средний</option>
                  <option value="4">Крупный</option>
                  <option value="5">Очень крупный</option>
                  <option value="6">Огромный</option>
                  <option value="7">Максимальный</option>
                </select>
                <input
                  type="color"
                  onChange={(e) => {
                    const editor = document.getElementById("editorContent");
                    if (editor) editor.focus();
                    document.execCommand("foreColor", false, e.target.value);
                  }}
                  className="h-8 w-8"
                />
                <button
                  onClick={() => {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                      setSavedRange(selection.getRangeAt(0));
                    }
                    setShowLinkBar(!showLinkBar);
                  }}
                  className="p-1 border rounded"
                >
                  Ссылка
                </button>
              </div>
              <div className="flex items-center gap-4">
                {showLinkBar && (
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Введите ссылку"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="p-1 border rounded"
                    />
                    <button
                      onClick={() => {
                        if (savedRange) {
                          const selection = window.getSelection();
                          selection.removeAllRanges();
                          selection.addRange(savedRange);
                        }
                        document.execCommand("createLink", false, linkUrl);
                        setShowLinkBar(false);
                        setLinkUrl("");
                        setSavedRange(null);
                      }}
                      className="p-1 border rounded bg-blue-500 text-white"
                    >
                      Применить
                    </button>
                  </div>
                )}
                <div className="relative">
                  <button
                    onClick={() => setShowAlignDropdown(!showAlignDropdown)}
                    className="p-1 border rounded"
                  >
                    Выравнивание
                  </button>
                  {showAlignDropdown && (
                    <div className="absolute top-full left-0 bg-white border rounded shadow mt-1 z-10">
                      <button
                        onClick={() => {
                          const editor =
                            document.getElementById("editorContent");
                          if (editor) editor.focus();
                          document.execCommand("justifyLeft", false, null);
                          setShowAlignDropdown(false);
                        }}
                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        Слева
                      </button>
                      <button
                        onClick={() => {
                          const editor =
                            document.getElementById("editorContent");
                          if (editor) editor.focus();
                          document.execCommand("justifyCenter", false, null);
                          setShowAlignDropdown(false);
                        }}
                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        По центру
                      </button>
                      <button
                        onClick={() => {
                          const editor =
                            document.getElementById("editorContent");
                          if (editor) editor.focus();
                          document.execCommand("justifyRight", false, null);
                          setShowAlignDropdown(false);
                        }}
                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        Справа
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              id="editorContent"
              contentEditable
              className="border p-2 h-96 overflow-auto rounded bg-transparent"
            >
              <div
                dangerouslySetInnerHTML={{ __html: editorModal.initialValue }}
              />
            </div>
          </>
        )}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={handleSaveEditor}
            className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition"
          >
            Сохранить
          </button>
          <button
            onClick={handleCancelEditor}
            className="bg-gray-300 text-black py-1 px-4 rounded hover:bg-gray-400 transition"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextEditorModel;
