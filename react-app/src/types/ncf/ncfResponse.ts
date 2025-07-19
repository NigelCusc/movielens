export type NcfResponse = {
  user_id: number; // The ID of the user for whom recommendations are generated
  recommended_movies: {
    movie_id: number; // The ID of the recommended movie
    title: string; // The title of the recommended movie
  }[]; // Array of recommended movies with their similarity scores
};
