from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from pprint import pprint
from scipy.sparse import csr_matrix # for sparse matrices
from sklearn.neighbors import NearestNeighbors # for nearest neighbors models

# Load your required models and data
items_df = pd.read_csv('./data/items.csv')
ratings_df = pd.read_csv('./data/ratings.csv')
movie_df = pd.read_csv('./data/items.csv')
df = pd.merge(ratings_df, items_df, on='movie_id')
# keep only required columns
df = df[['user_id', 'movie_id', 'rating', 'title']]
refined_dataset = df.groupby(by=['user_id','title'], as_index=False).agg({"rating":"mean"})
users_df = refined_dataset.pivot_table(index="user_id",columns='title',values='rating').fillna(0)

# Movie name list
movies_list = users_df.columns

users_sparse = csr_matrix(users_df.values)
model_knn= NearestNeighbors(metric= 'cosine', algorithm='brute')
model_knn.fit(users_sparse)

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

def get_similar_users(user_id, n=5):
    """ Get n similar users to the given user using KNN.
    :param user: User ID for which to find similar users.
    :param n: Number of similar users to return.
    :return: Tuple of similar user IDs and their distances.
    """
    if user_id < 1 or user_id > len(users_df):
        raise ValueError(f"User ID {user_id} is out of bounds. Must be between 1 and {len(users_df)}.")
    knn_input = np.asarray([users_df.values[user_id - 1]])
    distances, indices = model_knn.kneighbors(knn_input, n_neighbors=n + 1)
    return indices.flatten()[1:] + 1, distances.flatten()[1:]

@app.route('/recommend-movies/knn', methods=['POST'])
def recommend_movies_knn():
    """ Endpoint to recommend movies using KNN based collaborative filtering.
    This endpoint expects a JSON payload with user_id, n_similar_users, and n_movies.
    Example payload:
    {
        "user_id": 1,
        "n_similar_users": 5,
        "n_movies": 10
    }
    """
    # Extract user_id, n_similar_users, and n_movies from the request
    data = request.json
    print("Received data:", data)
    user_id = int(data['user_id'])
    n_similar_users = int(data.get('n_similar_users', 5))
    n_movies = int(data.get('n_movies', 10))

    print(f"Received request for user_id: {user_id}, n_similar_users: {n_similar_users}, n_movies: {n_movies}")

    similar_user_list, distance_list = get_similar_users(user_id, n_similar_users)

    weightage_list = distance_list / np.sum(distance_list)
    mov_rtngs_sim_users = users_df.values[similar_user_list]
    weightage_list = weightage_list[:, np.newaxis] + np.zeros(len(movies_list))
    new_rating_matrix = weightage_list * mov_rtngs_sim_users
    mean_rating_list = new_rating_matrix.sum(axis=0)

    first_zero_index = np.where(mean_rating_list == 0)[0][-1] if np.any(mean_rating_list == 0) else len(mean_rating_list)
    sortd_index = np.argsort(mean_rating_list)[::-1]
    sortd_index = sortd_index[:list(sortd_index).index(first_zero_index)] if first_zero_index < len(mean_rating_list) else sortd_index
    n = min(len(sortd_index), n_movies)

    movies_watched = list(refined_dataset[refined_dataset['user_id'] == user_id]['title'])
    filtered_movie_list = list(movies_list[sortd_index])
    recommended_movie_names = []

    # Filter out movies that the user has already watched
    for title in filtered_movie_list:
        if title not in movies_watched:
            recommended_movie_names.append(title)
        if len(recommended_movie_names) == n:
            break
    
    recommended_movie_ids = movie_df[movie_df['title'].isin(recommended_movie_names)]
    # map to array of objects with id and title
    recommended_movies = recommended_movie_ids[['movie_id', 'title']].to_dict(orient='records')
    response = {
        'user_id': user_id,
        'recommended_movies': recommended_movies,
        'similar_users': [
            {
                'user_id': int(similar_user),
                'distance': int(distance)
            } for similar_user, distance in zip(similar_user_list, distance_list)
        ] # type: ignore
    }
    
    return jsonify(response)

@app.route('/recommend-movies/ncf', methods=['POST'])
def recommend_movies_ncf():
    """ Endpoint to recommend movies using Neural Collaborative Filtering.
    This endpoint expects a JSON payload with user_id and n_movies.
    Example payload:
    {
        "user_id": 1,
        "n_movies": 10
    }
    """
    # import the NeuralCollaborativeFiltering class
    from neural_collaborative_filtering_class import NeuralCollaborativeFiltering

    data = request.json
    print("Received data:", data)
    user_id = int(data['user_id'])
    n_movies = int(data.get('n_movies', 10))

    print(f"Received request for user_id: {user_id}, n_movies: {n_movies}")

    ncf_model = NeuralCollaborativeFiltering(user_id)
    recommended_movies = ncf_model.recommend(top_n=n_movies)
    
    print("Response:", recommended_movies)
    
    return jsonify(recommended_movies)



# main driver function
if __name__ == '__main__':

    # run() method of Flask class runs the application 
    # on the local development server.
    app.run()