export default function routeBonusCodeManagement(id = "") {
  return `/bonus-code-management${id ? `/${id}` : ""}`;
}
