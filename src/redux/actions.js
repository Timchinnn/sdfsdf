export const setTheme = (theme) => ({
  type: "SET_THEME",
  payload: theme,
});
export const setCardBack = (style) => ({
  type: "SET_CARD_BACK",
  payload: style,
});
export const setLanguage = (language) => {
  localStorage.setItem("language", language); // Сохраняем при изменении
  return {
    type: "SET_LANGUAGE",
    payload: language,
  };
};
export const setImageQuality = (quality) => {
  localStorage.setItem("imageQuality", quality); // Сохраняем выбор пользователя
  return {
    type: "SET_IMAGE_QUALITY",
    payload: quality,
  };
};
