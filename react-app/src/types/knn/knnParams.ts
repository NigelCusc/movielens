export type KnnParams = {
  user_id: number;
  n_neighbors: number; // Number of similar users to consider
  n_recommendations: number; // Number of recommendations to return
};
