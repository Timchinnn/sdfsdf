const initialState = {
  theme: true,
  cardBack: "default",
  language: localStorage.getItem("language") || "ru", // Добавляем начальное значение языкаы
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_THEME":
      return {
        ...state,
        theme: action.payload,
      };
    case "SET_CARD_BACK":
      return {
        ...state,
        cardBack: action.payload,
      };
    case "SET_LANGUAGE":
      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
};
export default rootReducer;
