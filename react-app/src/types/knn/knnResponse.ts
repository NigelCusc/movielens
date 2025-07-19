export type KnnResponse = {
  user_id: number; // The ID of the user for whom recommendations are generated
  recommended_movies: {
    movie_id: number; // The ID of the recommended movie
    title: string; // The title of the recommended movie
  }[]; // Array of recommended movies with their similarity scores
  similar_users: {
    user_id: number; // The ID of the similar user
    distance: number; // The distance or similarity score to the userId
  }[]; // Array of similar users with their similarity scores
};
