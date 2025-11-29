const AVATAR_COLORS = [
  "#FFB7B2", // Soft Red
  "#B5EAD7", // Mint
  "#C7CEEA", // Periwinkle
  "#FFDAC1", // Peach
  "#E2F0CB", // Lime
  "#FF9AA2", // Pink
];

export const getChildInitials = (name: string) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const colorIndex = name.length % AVATAR_COLORS.length;
  const backgroundColor = AVATAR_COLORS[colorIndex];

  return { backgroundColor, initials };
};
