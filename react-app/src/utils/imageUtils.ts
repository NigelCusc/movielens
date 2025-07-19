export const getImageUrl = (id: number): string => {
  // get poster from public/posters
  const path = `/posters/${id}.jpg`; // Assuming the images are stored in public/posters with the id as the filename
  const imageUrl = process.env.PUBLIC_URL + path;
  return imageUrl;
};
