export const getFirstWord = (sentence: string): string => {
  const words = sentence.trim().split(/\s+/);
  return words[0] || "";
};
