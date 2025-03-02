import React from "react";
import "./Constructor.css";

const ProjectsBlockPreview = ({ block }) => {
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
          block.items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg shadow-md p-4 bg-white"
              style={{ backgroundColor: item.elementColor || "#ffffff" }}
            >
              {item.image && item.image.trim() !== "" && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto rounded mb-4"
                />
              )}
              <h3
                className="text-xl font-semibold mb-2"
                dangerouslySetInnerHTML={{ __html: item.title }}
              ></h3>
              <div
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: item.description }}
              ></div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProjectsBlockPreview;
