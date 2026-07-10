export const formatErrorMessage = (error) => {
  if (!error) return "An error occurred";
  if (typeof error === "string") return error;
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.message) return error.message;
  return "An error occurred";
};
