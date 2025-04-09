// src/services/api.js
import axios from "../axios-controller";

export const userService = {
  getUser: (id) => axios.get(`/user/${id}`),
  updateSettings: (userId, settings) =>
    axios.put("/user/settings", { userId, settings }),
};
export const userInitService = {
  // Инициализация пользователя
  initUser: (telegram_id, username) =>
    axios.post("/user/init", {
      telegram_id,
      username,
      level: 1,
      experience: 0,
      coins: 0,
      vibration: true,
      darkTheme: false,
      language: "ru",
    }),

  // Получение данных пользователя по telegram_id
  getUser: (telegram_id) => axios.get(`/user/${telegram_id}`),
  getHourlyIncome: (telegram_id) => axios.get(`/hourly-income/${telegram_id}`),
  getEnergy: (telegram_id) => axios.get(`/user/${telegram_id}/energy`),
  updateEnergy: async (telegram_id, energy) => {
    try {
      // Добавим проверку входных данных
      if (!telegram_id || energy === undefined) {
        throw new Error("Отсутствуют необходимые параметры");
      }

      const response = await axios.put(`/user/${telegram_id}/energy`, {
        energy: Math.max(0, Math.min(energy, 1000)), // Ограничиваем значение от 0 до 1000
        lastUpdate: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error("Error updating energy:", error);
      throw error;
    }
  },
  getUserLevel: (telegram_id) => axios.get(`/user/${telegram_id}/level`),
  updateUserPhoto: (telegram_id, photo_url) =>
    axios.put(`/user/${telegram_id}/photo`, { photo_url }),
  updateExperience: (telegram_id, experience) =>
    axios.put(`/user/${telegram_id}/experience`, { experience }),
  getReferralCode: (telegram_id) =>
    axios.get(`/user/${telegram_id}/referral-code`),
  getReferrals: (telegram_id) => axios.get(`/user/${telegram_id}/referrals`),
  getAccumulatedIncome: (telegram_id) =>
    axios.get(`/user/${telegram_id}/accumulated-income`),
  collectIncome: (telegram_id) =>
    axios.put(`/user/${telegram_id}/collect-income`),
};
export const cardsService = {
  getAllCards: () => axios.get("/cards"),
  getCardsByType: (type) => axios.get(`/cards/${type}`),
  getCard: (id) => axios.get(`/cards/${id}`),
  deleteCard: (id) => axios.delete(`/cards/${id}`),
  updateCard: (id, formData) => axios.put(`/cards/${id}`, formData),
  createCard: (formData) =>
    axios.post("/cards", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
export const cardBackService = {
  getAllCardBacks: () => axios.get("/card-backs"),
  getUserCardBack: (telegram_id) => axios.get(`/user/${telegram_id}/card-back`),
  updateUserCardBack: (userId, data) =>
    axios.put(`/user/${userId}/card-back`, data),
  addCardBack: (formData) => axios.post("/card-backs/add", formData),
  deleteCardBack: (id) => axios.delete(`/card-backs/${id}`),
};
export const cardSetsService = {
  addCardToSet: (setId, cardId) =>
    axios.post(`/card-sets/${setId}/cards`, { cardId }),
  deleteCardSet: (setId) => axios.delete(`/card-sets/${setId}`),

  getSetCards: (setId) => axios.get(`/card-sets/${setId}/cards`),
  removeCardFromSet: (setId, cardId) =>
    axios.delete(`/card-sets/${setId}/cards/${cardId}`),
  getAllCardSets: () => axios.get("/card-sets"),
  getSetRewards: (setId) => axios.get(`/card-sets/${setId}/rewards`),
  updateSetRewards: (setId, data) => axios.put(`/card-sets/${setId}`, data),
  createCardSet: (data) => {
    const formattedRewards = data.rewards.map((reward) => ({
      reward_type: reward.type,
      reward_value: reward.value || 0, // Устанавливаем значение по умолчанию 0
    }));
    return axios.post("/card-sets", {
      title: data.title,
      description: data.description,
      rewards: formattedRewards,
    });
  }, // Получение карт конкретного набора
  checkSetCompletion: (setId, telegram_id) =>
    axios.get(`/card-sets/${setId}/check-completion/${telegram_id}`),

  // Проверка завершения набора
};
export const tasksService = {
  getAllTasks: () => axios.get("/tasks"),
};
export const adsService = {
  // Получение всех объявлений
  getAllAds: () => axios.get("/ads"),
  testReward: (telegram_id, adId) =>
    axios.post(`/process-reward/${telegram_id}`, { adId }),

  // Удаление объявления по id
  deleteAd: (id) => axios.delete(`/ads/${id}`),

  // Создание нового объявления
  createAd: (formData) => axios.post("/ads", formData),
};
export const processReward = async (
  telegram_id,
  reward_url,
  default_reward
) => {
  try {
    if (!telegram_id) {
      throw new Error("Отсутствует обязательный параметр: telegram_id");
    }
    // Если передан default_reward, используем альтернативную логику
    if (default_reward) {
      console.log("Используем альтернативную логику начисления награды");
      const response = await axios.post(
        `/process-reward/${telegram_id}`,
        {
          default_reward: true,
          reward_type: default_reward.type,
          reward_amount: default_reward.amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    }
    // Стандартная логика с reward_url
    if (!reward_url) {
      throw new Error("Отсутствует reward_url и не передан default_reward");
    }
    const response = await axios.post(
      `/process-reward/${telegram_id}`,
      { reward_url },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status !== 200) {
      throw new Error(`Сервер вернул статус: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error("Ошибка при обработке награды:", error);
    throw new Error(`Не удалось обработать награду: ${error.message}`);
  }
};
export const userCardsService = {
  // Получение карточек пользователя
  getUserCards: (userId) => axios.get(`/user/${userId}/cards`),

  // Добавление карточки пользователю
  addCardToUser: (userId, cardId) =>
    axios.post(`/user/${userId}/cards`, { cardId }),
};

export const peopleService = {
  // Получение списка фотографий для полиции
  async getPolicePhotos() {
    try {
      const response = await axios.get(`/police/photos`);
      return response.data;
    } catch (error) {
      console.error("Error fetching police photos:", error);
      throw error;
    }
  },

  // Получение списка фотографий для пожарных
  async getFirefighterPhotos() {
    try {
      const response = await axios.get(`/firefighter/photos`);
      return response.data;
    } catch (error) {
      console.error("Error fetching firefighter photos:", error);
      throw error;
    }
  },
};
