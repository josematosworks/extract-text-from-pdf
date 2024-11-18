export const isPDF = (file: File): boolean => {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
};

export const isValidFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

export const sanitizeText = (text: string): string => {
  return text.replace(/\s+/g, " ").trim();
};
