// const routeAddEditDeck = () => `/addEditDeck`;
const routeAddEditDeck = (id) => (id ? `/addEditDeck/${id}` : "/addEditDeck");

export default routeAddEditDeck;
