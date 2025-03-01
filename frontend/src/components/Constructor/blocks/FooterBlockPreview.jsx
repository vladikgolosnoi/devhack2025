import React from "react";

const FooterBlockPreview = ({ block }) => {
  const textElements = block.textElements || [];
  const gridColumns = block.gridColumns || 1;

  return (
    <div
      className="max-w-4xl mx-auto p-8 border rounded-lg shadow-xl mb-6"
      style={{
        backgroundColor: block.footerBackground,
        display: "grid",
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gap: "1rem",
      }}
    >
      {textElements.length > 0 ? (
        textElements.map((el) => (
          <div
            key={el.id}
            className="p-4 border rounded"
            style={{ backgroundColor: el.boxColor || "#ffffff" }}
          >
            <div dangerouslySetInnerHTML={{ __html: el.text || "Пусто" }} />
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">Нет текстовых элементов</p>
      )}
    </div>
  );
};

export default FooterBlockPreview;
