import React, { useState, useEffect } from "react";
import { getWebsite, updateWebsite } from "@/components/api/sites";
import { useParams } from "react-router-dom";
import HomeBlockEditor from "./blocks/HomeBlockEditor";
import HomeBlockPreview from "./blocks/HomeBlockPreview";
import FooterBlockEditor from "./blocks/FooterBlockEditor";
import FooterBlockPreview from "./blocks/FooterBlockPreview";
import ProjectsBlockEditor from "./blocks/ProjectsBlockEditor";
import ProjectsBlockPreview from "./blocks/ProjectsBlockPreview";
import ContactsBlockEditor from "./blocks/ContactsBlockEditor";
import ContactsBlockPreview from "./blocks/ContactsBlockPreview";
import PremiumContactsBlockEditor from "./blocks/PremiumContactsBlockEditor";
import PremiumContactsBlockPreview from "./blocks/PremiumContactsBlockPreview";
import TextEditorModel from "./TextEditorModel";
import { getProfile } from "@/components/api/profile";

function Constructor() {
  const { unique_id } = useParams();

  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileData = await getProfile();
        setIsPremium(profileData?.subscription === "premium");
      } catch (error) {
        console.error("Ошибка получения профиля:", error);
      }
    }
    fetchProfile();
  }, []);

  // Дефолтный блок "Главная"
  const getDefaultHomeBlock = () => ({
    id: Date.now(),
    blockType: "home",
    sectionTitle: "Добро пожаловать!",
    sectionDescription: "",
    sectionColor: "#ffffff",
    itemStyle: "home",
    collapsed: false,
    items: [
      {
        id: Date.now() + 1,
        title: "Профессия",
        description: "Описание слогана и краткая информация.",
        image:
          "https://avatars.dzeninfra.ru/get-zen_doc/230865/pub_5b5032f086603300a9cca63f_5b5033074cfa8b00ab54d1e4/scale_1200",
        imageAlign: "left",
      },
    ],
  });

  // Дефолтный блок "Footer"
  const getDefaultFooterBlock = () => ({
    id: Date.now(),
    blockType: "footer",
    collapsed: false,
    footerBackground: "#ffffff",
    gridColumns: 1,
    textElements: [
      {
        id: Date.now() + 1,
        text: "Новый текстовый элемент",
        collapsed: false,
        boxColor: "#ffffff",
      },
    ],
  });

  // Дефолтный блок "Проекты"
  const getDefaultProjectsBlock = () => ({
    id: Date.now(),
    blockType: "projects",
    sectionTitle: "Наши проекты и награды",
    sectionDescription:
      "Здесь вы можете увидеть наши реализованные проекты и полученные награды.",
    sectionColor: "#f5f5f5",
    gridColumns: 2,
    collapsed: false,
    items: [
      {
        id: Date.now() + 1,
        title: "Проект 1",
        description: "Описание проекта 1",
        image: "https://via.placeholder.com/300x200?text=Проект+1",
        imageAlign: "top",
        elementColor: "#ffffff",
      },
    ],
  });

  // Дефолтный блок "Контакты"
  const getDefaultContactsBlock = () => ({
    id: Date.now(),
    blockType: "contacts",
    sectionTitle: "Контакты",
    sectionDescription: "Здесь вы можете указать ссылки на ваши контакты.",
    sectionColor: "#e0f7fa",
    gridColumns: 2,
    collapsed: false,
    items: [
      {
        id: Date.now() + 1,
        title: "Email",
        description: "contact@example.com",
        link: "mailto:contact@example.com",
        elementColor: "#ffffff",
      },
    ],
  });

  // Дефолтный блок "Премиум Контакты"
  const getDefaultPremiumContactsBlock = () => ({
    id: Date.now(),
    blockType: "premiumContacts",
    sectionTitle: "Премиум Контакты",
    sectionDescription:
      "Эксклюзивный блок контактов для премиум пользователей.",
    gradientStart: "#ffd700",
    gradientEnd: "#ffb700",
    sectionColor: `linear-gradient(to right, #ffd700, #ffb700)`,
    gridColumns: 2,
    collapsed: false,
    items: [
      {
        id: Date.now() + 1,
        title: "VKONTAKTE",
        description: "Ваш профиль VK",
        link: "https://vk.com",
        socialType: "vk",
        elementColor: "#ffffff",
      },
    ],
  });

  const [blocks, setBlocks] = useState([getDefaultHomeBlock()]);
  const [pageBackground, setPageBackground] = useState("#ffffff");
  const [selectedBlockType, setSelectedBlockType] = useState("home");
  const [websiteData, setWebsiteData] = useState({ name: "", site_type: "" });

  const testTemplate = {
    pageBackground: "#ffffff",
    blocks: [],
  };

  useEffect(() => {
    async function loadWebsite() {
      try {
        const profileResponse = await getProfile();
        const username = profileResponse?.user?.username;

        if (!username) {
          console.error("Ошибка: не удалось получить имя пользователя.");
          return;
        }

        const data = await getWebsite(username, unique_id);
        if (!data || !data.data || Object.keys(data.data).length === 0) {
          setBlocks(testTemplate.blocks);
          setPageBackground(testTemplate.pageBackground);
        } else {
          setWebsiteData({
            name: data.name,
            site_type: data.site_type,
          });

          let loadedBlocks = data.data.blocks || [];
          if (loadedBlocks.length === 0) {
            loadedBlocks = [getDefaultHomeBlock()];
          }

          setBlocks(loadedBlocks);
          setPageBackground(data.data.pageBackground || "#ffffff");
        }
      } catch (error) {
        console.error("Ошибка загрузки сайта:", error);
        setBlocks(testTemplate.blocks);
        setPageBackground(testTemplate.pageBackground);
      }
    }

    if (unique_id) {
      loadWebsite();
    }
  }, [unique_id]);

  // Функция добавления нового блока с выбором типа
  const handleAddBlock = () => {
    let newBlock;
    if (selectedBlockType === "home") {
      newBlock = getDefaultHomeBlock();
    } else if (selectedBlockType === "footer") {
      newBlock = getDefaultFooterBlock();
    } else if (selectedBlockType === "projects") {
      newBlock = getDefaultProjectsBlock();
    } else if (selectedBlockType === "contacts") {
      newBlock = getDefaultContactsBlock();
    } else if (selectedBlockType === "premiumContacts") {
      if (!isPremium) {
        alert("Доступно только для премиум пользователей");
        return;
      }
      newBlock = getDefaultPremiumContactsBlock();
    }

    if (newBlock) {
      setBlocks([...blocks, newBlock]);
    }
  };

  // Функции управления блоками (перемещение, обновление, удаление)
  const moveBlockUp = (index) => {
    if (index === 0) return;
    const newBlocks = [...blocks];
    [newBlocks[index - 1], newBlocks[index]] = [
      newBlocks[index],
      newBlocks[index - 1],
    ];
    setBlocks(newBlocks);
  };

  const moveBlockDown = (index) => {
    if (index < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[index], newBlocks[index + 1]] = [
        newBlocks[index + 1],
        newBlocks[index],
      ];
      setBlocks(newBlocks);
    }
  };

  const updateBlockField = (blockId, field, value) => {
    setBlocks(
      blocks.map((block) =>
        block.id === blockId ? { ...block, [field]: value } : block
      )
    );
  };

  const removeBlock = (blockId) => {
    setBlocks(blocks.filter((block) => block.id !== blockId));
  };

  // Функции для работы с элементами в блоке Footer
  const addFooterTextElement = (blockId) => {
    const newTextElement = {
      id: Date.now(),
      text: "Новый текстовый элемент",
      collapsed: false,
      boxColor: "#ffffff",
    };
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId && block.blockType === "footer") {
          return {
            ...block,
            textElements: [...block.textElements, newTextElement],
          };
        }
        return block;
      })
    );
  };

  const moveFooterTextElementUp = (blockId, index) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId && block.blockType === "footer" && index > 0) {
          const newElements = [...block.textElements];
          [newElements[index - 1], newElements[index]] = [
            newElements[index],
            newElements[index - 1],
          ];
          return { ...block, textElements: newElements };
        }
        return block;
      })
    );
  };

  const moveFooterTextElementDown = (blockId, index) => {
    setBlocks(
      blocks.map((block) => {
        if (
          block.id === blockId &&
          block.blockType === "footer" &&
          index < block.textElements.length - 1
        ) {
          const newElements = [...block.textElements];
          [newElements[index], newElements[index + 1]] = [
            newElements[index + 1],
            newElements[index],
          ];
          return { ...block, textElements: newElements };
        }
        return block;
      })
    );
  };

  const updateFooterTextElement = (blockId, elementId, field, value) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId && block.blockType === "footer") {
          const newElements = block.textElements.map((el) =>
            el.id === elementId ? { ...el, [field]: value } : el
          );
          return { ...block, textElements: newElements };
        }
        return block;
      })
    );
  };

  const removeFooterTextElement = (blockId, elementId) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId && block.blockType === "footer") {
          const newElements = block.textElements.filter(
            (el) => el.id !== elementId
          );
          return { ...block, textElements: newElements };
        }
        return block;
      })
    );
  };

  // Функция для обновления элемента в блоке "Главная"
  const updateHomeItemField = (blockId, itemId, field, value) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId && block.blockType === "home") {
          const newItems = block.items.map((item) =>
            item.id === itemId ? { ...item, [field]: value } : item
          );
          return { ...block, items: newItems };
        }
        return block;
      })
    );
  };

  // Функции для работы с элементами в блоке "Проекты"
  const addProjectElement = (blockId) => {
    const newElement = {
      id: Date.now(),
      title: "Новый элемент",
      description: "Описание нового элемента",
      image: "",
      imageAlign: "top",
    };
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId && block.blockType === "projects") {
          return { ...block, items: [...block.items, newElement] };
        }
        return block;
      })
    );
  };

  const moveProjectElementUp = (blockId, index) => {
    setBlocks(
      blocks.map((block) => {
        if (
          block.id === blockId &&
          block.blockType === "projects" &&
          index > 0
        ) {
          const newItems = [...block.items];
          [newItems[index - 1], newItems[index]] = [
            newItems[index],
            newItems[index - 1],
          ];
          return { ...block, items: newItems };
        }
        return block;
      })
    );
  };

  const moveProjectElementDown = (blockId, index) => {
    setBlocks(
      blocks.map((block) => {
        if (
          block.id === blockId &&
          block.blockType === "projects" &&
          index < block.items.length - 1
        ) {
          const newItems = [...block.items];
          [newItems[index], newItems[index + 1]] = [
            newItems[index + 1],
            newItems[index],
          ];
          return { ...block, items: newItems };
        }
        return block;
      })
    );
  };

  const removeProjectElement = (blockId, elementId) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId && block.blockType === "projects") {
          const newItems = block.items.filter((el) => el.id !== elementId);
          return { ...block, items: newItems };
        }
        return block;
      })
    );
  };

  const updateProjectElement = (blockId, elementId, field, value) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId && block.blockType === "projects") {
          const newItems = block.items.map((el) =>
            el.id === elementId ? { ...el, [field]: value } : el
          );
          return { ...block, items: newItems };
        }
        return block;
      })
    );
  };

  // Функции для работы с элементами в блоке "Контакты"
  const addContactElement = (blockId) => {
    const newElement = {
      id: Date.now(),
      title: "Новый контакт",
      description: "Описание контакта",
      link: "",
      elementColor: "#ffffff",
    };
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId && block.blockType === "contacts") {
          return { ...block, items: [...block.items, newElement] };
        }
        return block;
      })
    );
  };

  const moveContactElementUp = (blockId, index) => {
    setBlocks(
      blocks.map((block) => {
        if (
          block.id === blockId &&
          block.blockType === "contacts" &&
          index > 0
        ) {
          const newItems = [...block.items];
          [newItems[index - 1], newItems[index]] = [
            newItems[index],
            newItems[index - 1],
          ];
          return { ...block, items: newItems };
        }
        return block;
      })
    );
  };

  const moveContactElementDown = (blockId, index) => {
    setBlocks(
      blocks.map((block) => {
        if (
          block.id === blockId &&
          block.blockType === "contacts" &&
          index < block.items.length - 1
        ) {
          const newItems = [...block.items];
          [newItems[index], newItems[index + 1]] = [
            newItems[index + 1],
            newItems[index],
          ];
          return { ...block, items: newItems };
        }
        return block;
      })
    );
  };

  const removeContactElement = (blockId, elementId) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId && block.blockType === "contacts") {
          const newItems = block.items.filter((el) => el.id !== elementId);
          return { ...block, items: newItems };
        }
        return block;
      })
    );
  };

  const updateContactElement = (blockId, elementId, field, value) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId && block.blockType === "contacts") {
          const newItems = block.items.map((el) =>
            el.id === elementId ? { ...el, [field]: value } : el
          );
          return { ...block, items: newItems };
        }
        return block;
      })
    );
  };

  const addPremiumContactElement = (blockId) => {
    const newElement = {
      id: Date.now(),
      title: "Новый контакт",
      description: "Описание контакта",
      link: "",
      socialType: "vk",
      elementColor: "#ffffff",
    };
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId && block.blockType === "premiumContacts") {
          return { ...block, items: [...block.items, newElement] };
        }
        return block;
      })
    );
  };

  const movePremiumContactElementUp = (blockId, index) => {
    setBlocks(
      blocks.map((block) => {
        if (
          block.id === blockId &&
          block.blockType === "premiumContacts" &&
          index > 0
        ) {
          const newItems = [...block.items];
          [newItems[index - 1], newItems[index]] = [
            newItems[index],
            newItems[index - 1],
          ];
          return { ...block, items: newItems };
        }
        return block;
      })
    );
  };

  const movePremiumContactElementDown = (blockId, index) => {
    setBlocks(
      blocks.map((block) => {
        if (
          block.id === blockId &&
          block.blockType === "premiumContacts" &&
          index < block.items.length - 1
        ) {
          const newItems = [...block.items];
          [newItems[index], newItems[index + 1]] = [
            newItems[index + 1],
            newItems[index],
          ];
          return { ...block, items: newItems };
        }
        return block;
      })
    );
  };

  const removePremiumContactElement = (blockId, elementId) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId && block.blockType === "premiumContacts") {
          const newItems = block.items.filter((el) => el.id !== elementId);
          return { ...block, items: newItems };
        }
        return block;
      })
    );
  };

  const updatePremiumContactElement = (blockId, elementId, field, value) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId && block.blockType === "premiumContacts") {
          const newItems = block.items.map((el) =>
            el.id === elementId ? { ...el, [field]: value } : el
          );
          return { ...block, items: newItems };
        }
        return block;
      })
    );
  };

  // Модальное окно редактора
  const [editorModal, setEditorModal] = useState({
    open: false,
    blockId: null,
    itemId: null,
    field: "",
    initialValue: "",
  });
  const [showLinkBar, setShowLinkBar] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [savedRange, setSavedRange] = useState(null);
  const [showAlignDropdown, setShowAlignDropdown] = useState(false);

  const openEditor = (blockId, field, initialValue, itemId = null) => {
    setEditorModal({ open: true, blockId, itemId, field, initialValue });
    if (field === "image") {
      setShowLinkBar(true);
      setLinkUrl(initialValue);
    } else {
      setShowLinkBar(false);
      setLinkUrl("");
    }
  };

  const handleSaveEditor = () => {
    let newValue = "";
    if (editorModal.field === "image") {
      newValue = document.getElementById("imageURL").value;
    } else {
      newValue = document.getElementById("editorContent").innerHTML;
    }
    setBlocks(
      blocks.map((block) => {
        if (block.id === editorModal.blockId) {
          if (editorModal.itemId) {
            if (block.blockType === "home") {
              const newItems = block.items.map((item) =>
                item.id === editorModal.itemId
                  ? { ...item, [editorModal.field]: newValue }
                  : item
              );
              return { ...block, items: newItems };
            } else if (block.blockType === "footer") {
              const newElements = block.textElements.map((el) =>
                el.id === editorModal.itemId
                  ? { ...el, [editorModal.field]: newValue }
                  : el
              );
              return { ...block, textElements: newElements };
            } else if (block.blockType === "projects") {
              const newItems = block.items.map((item) =>
                item.id === editorModal.itemId
                  ? { ...item, [editorModal.field]: newValue }
                  : item
              );
              return { ...block, items: newItems };
            } else if (block.blockType === "contacts") {
              const newItems = block.items.map((item) =>
                item.id === editorModal.itemId
                  ? { ...item, [editorModal.field]: newValue }
                  : item
              );
              return { ...block, items: newItems };
            } else if (block.blockType === "premiumContacts") {
              const newItems = block.items.map((item) =>
                item.id === editorModal.itemId
                  ? { ...item, [editorModal.field]: newValue }
                  : item
              );
              return { ...block, items: newItems };
            }
          } else {
            return { ...block, [editorModal.field]: newValue };
          }
        }
        return block;
      })
    );
    setEditorModal({
      open: false,
      blockId: null,
      itemId: null,
      field: "",
      initialValue: "",
    });
    setShowLinkBar(false);
    setLinkUrl("");
  };

  const handleCancelEditor = () => {
    setEditorModal({
      open: false,
      blockId: null,
      itemId: null,
      field: "",
      initialValue: "",
    });
    setShowLinkBar(false);
    setLinkUrl("");
  };

  const handleSaveConstructor = async () => {
    const profileResponse = await getProfile();
    const username = profileResponse?.user?.username;
    if (!username) {
      console.error("Не удалось получить имя пользователя из профиля.");
      alert("Ошибка: не удалось получить имя пользователя");
      return;
    }

    try {
      const websiteResponse = await getWebsite(username, unique_id);
      if (!websiteResponse) {
        console.error("Ошибка: сайт не найден.");
        alert("Ошибка: сайт не найден");
        return;
      }

      const constructorData = {
        name: websiteResponse.name,
        site_type: websiteResponse.site_type,
        data: {
          pageBackground,
          blocks,
        },
      };

      console.log("Отправляемые данные:", constructorData);
      const response = await updateWebsite(
        username,
        unique_id,
        constructorData
      );

      console.log(
        "Сохранённые данные:",
        JSON.stringify(constructorData, null, 2)
      );
      console.log("Ответ от сервера:", response);
      alert("Конфигурация сохранена!");
    } catch (error) {
      console.error("Ошибка при сохранении сайта:", error);
      alert("Ошибка при сохранении сайта");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Левая панель – редактор */}
      <aside className="col-span-1 p-8 bg-gray-50 border-r overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-600">
          Конструктор сайта
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Фон страницы</label>
          <input
            type="color"
            value={pageBackground}
            onChange={(e) => setPageBackground(e.target.value)}
            className="w-full h-12 rounded border"
          />
        </div>
        {/* Выбор типа блока и кнопка добавления */}
        <div className="mb-6">
          <select
            value={selectedBlockType}
            onChange={(e) => setSelectedBlockType(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
          >
            <option value="home">Блок "Главная"</option>
            <option value="footer">Блок "Footer"</option>
            <option value="projects">Блок "Проекты, Награды"</option>
            <option value="contacts">Блок "Контакты"</option>
            <option value="premiumContacts" disabled={!isPremium}>
              {isPremium
                ? "Премиум Контакты 👑"
                : "Премиум Контакты (Premium Only)"}
            </option>
          </select>
          <button
            onClick={handleAddBlock}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            Добавить блок
          </button>
        </div>
        {blocks.map((block, index) => {
          if (block.blockType === "home") {
            return (
              <HomeBlockEditor
                key={block.id}
                block={block}
                onUpdateField={updateBlockField}
                onOpenEditor={openEditor}
                onRemoveBlock={removeBlock}
                onMoveBlockUp={() => moveBlockUp(index)}
                onMoveBlockDown={() => moveBlockDown(index)}
                onUpdateItemField={updateHomeItemField}
              />
            );
          } else if (block.blockType === "footer") {
            return (
              <FooterBlockEditor
                key={block.id}
                block={block}
                onUpdateField={updateBlockField}
                onRemoveBlock={removeBlock}
                onMoveBlockUp={() => moveBlockUp(index)}
                onMoveBlockDown={() => moveBlockDown(index)}
                onAddTextElement={() => addFooterTextElement(block.id)}
                onRemoveTextElement={(elementId) =>
                  removeFooterTextElement(block.id, elementId)
                }
                onMoveTextElementUp={(index) =>
                  moveFooterTextElementUp(block.id, index)
                }
                onMoveTextElementDown={(index) =>
                  moveFooterTextElementDown(block.id, index)
                }
                onUpdateTextElement={(elementId, field, value) =>
                  updateFooterTextElement(block.id, elementId, field, value)
                }
                onOpenEditor={openEditor}
              />
            );
          } else if (block.blockType === "projects") {
            return (
              <ProjectsBlockEditor
                key={block.id}
                block={block}
                onUpdateField={updateBlockField}
                onRemoveBlock={removeBlock}
                onMoveBlockUp={() => moveBlockUp(index)}
                onMoveBlockDown={() => moveBlockDown(index)}
                onAddProjectElement={() => addProjectElement(block.id)}
                onRemoveProjectElement={(elementId) =>
                  removeProjectElement(block.id, elementId)
                }
                onMoveProjectElementUp={(index) =>
                  moveProjectElementUp(block.id, index)
                }
                onMoveProjectElementDown={(index) =>
                  moveProjectElementDown(block.id, index)
                }
                onUpdateProjectElement={(elementId, field, value) =>
                  updateProjectElement(block.id, elementId, field, value)
                }
                onOpenEditor={openEditor}
              />
            );
          } else if (block.blockType === "contacts") {
            return (
              <ContactsBlockEditor
                key={block.id}
                block={block}
                onUpdateField={updateBlockField}
                onRemoveBlock={removeBlock}
                onMoveBlockUp={() => moveBlockUp(index)}
                onMoveBlockDown={() => moveBlockDown(index)}
                onAddProjectElement={() => addContactElement(block.id)}
                onRemoveProjectElement={(elementId) =>
                  removeContactElement(block.id, elementId)
                }
                onMoveProjectElementUp={(index) =>
                  moveContactElementUp(block.id, index)
                }
                onMoveProjectElementDown={(index) =>
                  moveContactElementDown(block.id, index)
                }
                onUpdateProjectElement={(elementId, field, value) =>
                  updateContactElement(block.id, elementId, field, value)
                }
                onOpenEditor={openEditor}
              />
            );
          } else if (block.blockType === "premiumContacts") {
            return (
              <PremiumContactsBlockEditor
                key={block.id}
                block={block}
                onUpdateField={updateBlockField}
                onRemoveBlock={removeBlock}
                onMoveBlockUp={() => moveBlockUp(index)}
                onMoveBlockDown={() => moveBlockDown(index)}
                onAddProjectElement={() => addPremiumContactElement(block.id)}
                onRemoveProjectElement={(elementId) =>
                  removePremiumContactElement(block.id, elementId)
                }
                onMoveProjectElementUp={(index) =>
                  movePremiumContactElementUp(block.id, index)
                }
                onMoveProjectElementDown={(index) =>
                  movePremiumContactElementDown(block.id, index)
                }
                onUpdateProjectElement={(elementId, field, value) =>
                  updatePremiumContactElement(block.id, elementId, field, value)
                }
                onOpenEditor={openEditor}
              />
            );
          }
          return null;
        })}
        <div className="mt-8">
          <button
            onClick={handleSaveConstructor}
            className="w-full px-4 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
          >
            Сохранить сайт
          </button>
        </div>
      </aside>

      {/* Правая панель – предпросмотр */}
      <main
        className="col-span-1 p-8 overflow-y-auto"
        style={{ backgroundColor: pageBackground, minHeight: "100vh" }}
      >
        {blocks.map((block) => {
          if (block.blockType === "home") {
            return <HomeBlockPreview key={block.id} block={block} />;
          } else if (block.blockType === "footer") {
            return <FooterBlockPreview key={block.id} block={block} />;
          } else if (block.blockType === "projects") {
            return <ProjectsBlockPreview key={block.id} block={block} />;
          } else if (block.blockType === "contacts") {
            return <ContactsBlockPreview key={block.id} block={block} />;
          } else if (block.blockType === "premiumContacts") {
            return <PremiumContactsBlockPreview key={block.id} block={block} />;
          }
          return null;
        })}
      </main>

      {/* Модальное окно редактора */}
      {editorModal.open && (
        <TextEditorModel
          editorModal={editorModal}
          handleSaveEditor={handleSaveEditor}
          handleCancelEditor={handleCancelEditor}
          showLinkBar={showLinkBar}
          setShowLinkBar={setShowLinkBar}
          linkUrl={linkUrl}
          setLinkUrl={setLinkUrl}
          savedRange={savedRange}
          setSavedRange={setSavedRange}
          showAlignDropdown={showAlignDropdown}
          setShowAlignDropdown={setShowAlignDropdown}
        />
      )}
    </div>
  );
}

export default Constructor;
