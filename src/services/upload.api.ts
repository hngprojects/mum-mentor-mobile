// src/services/community/upload.api.ts

export const uploadImages = async (photos: { uri: string }[]) => {
  // MOCK UPLOAD DELAY
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return mock image URLs
  return photos.map(
    (p) =>
      `https://picsum.photos/seed/${Math.floor(
        Math.random() * 10000
      )}/600/600`
  );
};
