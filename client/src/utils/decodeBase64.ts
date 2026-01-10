export const decodeBase64 = <T>(base64: string): T | null => {
  try {
    const decoded = atob(base64);
    return JSON.parse(decoded) as T;
  } catch (error) {
    console.error("Failed to decode base64 string:", error);
    return null;
  }
};
