export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

export const getInitals = (title: string): string => {
    if (!title) return "";

    const words = title.split(" ");
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    }
    return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
}
  