import { apiRequest } from "./request";

export async function getProfile() {
  try {
    return await apiRequest("/accounts/profile/", "GET");
  } catch (error) {
    console.error("Ошибка загрузки профиля:", error);
    return null;
  }
}

export async function getProfileById(id) {
  try {
    return await apiRequest(`/accounts/users/${id}/`, "GET");
  } catch (error) {
    console.error("Ошибка загрузки профиля по ID:", error);
    return null;
  }
}

export async function updateProfile(data) {
  // Создаем объект FormData для обновления профиля
  const profileData = new FormData();

  // Добавляем данные в FormData
  profileData.append("email", data.email);
  profileData.append("first_name", data.first_name);
  profileData.append("last_name", data.last_name);
  profileData.append("middle_name", data.middle_name || "");
  profileData.append("age", data.age || "");
  profileData.append("profession", data.profession || "");
  profileData.append("bio", data.bio || "");

  // Добавляем файл, если он есть
  if (data.avatar) {
    profileData.append("avatar", data.avatar);
  }

  // Получаем токен из localStorage
  const token = localStorage.getItem("access_token");

  try {
    // Отправляем PUT запрос с FormData и необходимыми заголовками
    const response = await apiRequest(
      "/accounts/profile/update/",
      "PUT",
      profileData,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    // Возвращаем ответ от сервера
    return response;
  } catch (error) {
    console.error("Ошибка обновления профиля:", error);
    return null;
  }
}

export async function updateRating(user_id, action, value = 1) {
  return await apiRequest(`/accounts/profile/${user_id}/rating/`, "POST", {
    action,
    value,
  });
}

export async function getTopProfiles() {
  try {
    return await apiRequest("/accounts/top_profiles/", "GET");
  } catch (error) {
    console.error("Ошибка загрузки топ профилей:", error);
    return [];
  }
}
