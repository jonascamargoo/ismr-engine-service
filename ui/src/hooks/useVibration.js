export const useVibration = () => {
  const vibrate = (pattern = 200) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const stopVibration = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(0);
    }
  };

  return { vibrate, stopVibration };
};