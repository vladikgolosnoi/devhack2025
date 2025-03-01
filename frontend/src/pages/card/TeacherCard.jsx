import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TeacherCard() {
  const { id } = useParams();
  const [profileHTML, setProfileHTML] = useState("");

  useEffect(() => {
    const savedHTML = localStorage.getItem(id);
    if (savedHTML) {
      setProfileHTML(savedHTML);
    } else {
      setProfileHTML("<p>Профиль не найден.</p>");
    }
  }, [id]);

  return (
    <div
      className="profile-container"
      dangerouslySetInnerHTML={{ __html: profileHTML }}
    />
  );
}
