import React from "react";

const HomeBlockPreview = ({ block }) => {
  const item = block.items && block.items[0];
  return (
    <div
      className="max-w-4xl mx-auto p-8 border rounded-lg shadow-xl mb-6"
      style={{ backgroundColor: block.sectionColor }}
    >
      <h1
        className="text-4xl font-extrabold text-center mb-4"
        dangerouslySetInnerHTML={{ __html: block.sectionTitle }}
      />
      <div
        className="mx-auto text-center mb-6"
        dangerouslySetInnerHTML={{ __html: block.sectionDescription }}
      ></div>
      {item && (
        <div className="flex flex-col md:flex-row items-center">
          {item.imageAlign === "left" && item.image && (
            <div className="md:w-1/2 mb-4 md:mb-0 md:mr-4">
              <img
                src={item.image}
                alt="Элемент"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          <div className="md:w-1/2">
            <h2
              className="text-2xl font-semibold text-center mb-2"
              dangerouslySetInnerHTML={{ __html: item.title }}
            ></h2>
            <div
              className="mx-auto text-center"
              dangerouslySetInnerHTML={{ __html: item.description }}
            ></div>
          </div>
          {item.imageAlign === "right" && item.image && (
            <div className="md:w-1/2 mt-4 md:mt-0 md:ml-4">
              <img
                src={item.image}
                alt="Элемент"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeBlockPreview;
