export const isDev =
  process.env.REACT_APP_NODE_ENV === "development" &&
  process.env.REACT_APP_IS_LOCAL === "true";

const getUrl = () => {
  return `http://localhost:5000/crm/`;
};
export default getUrl;
