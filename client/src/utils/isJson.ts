export const isJSON = (jsonStr: string): boolean => {
  if (typeof jsonStr === "string") {
    try {
      JSON.parse(jsonStr);
      return true;
    } catch {
      return false;
    }
  }
  return false;
};
