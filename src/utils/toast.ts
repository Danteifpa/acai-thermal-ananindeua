export const showSuccess = (message: string) => {
  console.log("Success:", message);
  // Using a simple alert as a fallback for the fair
  alert(message);
};

export const showError = (message: string) => {
  console.error("Error:", message);
  alert("Erro: " + message);
};

export const showLoading = (message: string) => {
  console.log("Loading:", message);
  return "loading-id";
};

export const dismissToast = (toastId: string) => {
  console.log("Dismissing toast:", toastId);
};