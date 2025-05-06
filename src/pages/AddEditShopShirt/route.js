const routeAddEditShopShirt = (id = "") =>
  `/add-edit-shop-shirt${id ? `/${id}` : ""}`;
export default routeAddEditShopShirt;
