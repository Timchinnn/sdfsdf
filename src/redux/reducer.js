const initialState = {
  theme: true,
  cardBack: "default", // Добавить начальное состояние
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
    default:
      return state;
  }
};

export default rootReducer;
