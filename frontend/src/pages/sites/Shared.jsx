import React, { useState, useEffect } from "react";
import {
  getWebsite,
  getSharedWebsite,
  trackPageView,
} from "@/components/api/sites";
import { useParams, useNavigate } from "react-router-dom";
import HomeBlockPreview from "@/components/Constructor/blocks/HomeBlockPreview";
import FooterBlockPreview from "@/components/Constructor/blocks/FooterBlockPreview";
import ContactsBlockPreview from "@/components/Constructor/blocks/ContactsBlockPreview";
import ProjectsBlockPreview from "@/components/Constructor/blocks/ProjectsBlockPreview";
import PremiumContactsBlockPreview from "@/components/Constructor/blocks/PremiumContactsBlockPreview";

function Shared() {
  const { username, unique_id } = useParams();
  const navigate = useNavigate();
  const [pageBackground, setPageBackground] = useState("#ffffff");
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWebsite() {
      try {
        let data;
        data = await getSharedWebsite(username, unique_id);
        console.log(data, data.data, Object.keys(data.data).length);
        if (!data || !data.data || Object.keys(data.data).length === 0) {
          navigate("/404");
          return;
        } else {
          setBlocks(data.data.blocks || []);
          setPageBackground(data.data.pageBackground || "#ffffff");
        }
      } catch (error) {
        console.error("Ошибка загрузки сайта:", error);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    }
    if (unique_id) {
      loadWebsite();
    }
  }, [username, unique_id, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (username && unique_id) {
        trackPageView(username, unique_id).catch((err) =>
          console.error("Ошибка регистрации просмотра:", err)
        );
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [username, unique_id]);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: pageBackground }}>
      {blocks.map((block) => {
        if (block.blockType === "home") {
          return <HomeBlockPreview key={block.id} block={block} />;
        } else if (block.blockType === "footer") {
          return <FooterBlockPreview key={block.id} block={block} />;
        } else if (block.blockType === "contacts") {
          return <ContactsBlockPreview key={block.id} block={block} />;
        } else if (block.blockType === "projects") {
          return <ProjectsBlockPreview key={block.id} block={block} />;
        } else if (block.blockType === "premiumContacts") {
          return <PremiumContactsBlockPreview key={block.id} block={block} />;
        }
        return null;
      })}
    </div>
  );
}

export default Shared;
