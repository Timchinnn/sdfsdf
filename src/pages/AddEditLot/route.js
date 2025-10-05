// const routeAddEditLot = () => `/addEditLot`;
const routeAddEditLot = (id) => (id ? `/addEditLot/${id}` : "/addEditLot");

export default routeAddEditLot;
