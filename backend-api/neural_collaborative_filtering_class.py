import pandas as pd
# import sys
# sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from neural_collaborative_filtering.model.ncf_singlenode import NCF
from neural_collaborative_filtering.model.dataset import Dataset as NCFDataset
from neural_collaborative_filtering.dataset.splitters import python_chrono_split
import pickle

MODEL_CHECKPOINT = "model.ckpt"
PICKLE_FILE = "neural_collaborative_filtering/ncf_params.pkl"

# Load your required models and data
items_df = pd.read_csv('./data/items.csv')
ratings_df = pd.read_csv('./data/ratings.csv')
movie_df = pd.read_csv('./data/items.csv')
df = pd.merge(ratings_df, items_df, on='movie_id')
# keep only required columns
df = df[['user_id', 'movie_id', 'rating', 'unix_timestamp', 'title']]
df = df.sort_values(by='unix_timestamp', ascending=False).drop_duplicates(subset=['user_id', 'movie_id'], keep='first')
train_file = "./neural_collaborative_filtering/data/train.csv"
train, test = python_chrono_split(df, 0.75)

class NeuralCollaborativeFiltering:
    def __init__(self, user_id):
        self.user_id = user_id
        self.model = None
        self.load_model()

    def load_model(self):
        # Load parameters from pickle
        with open(PICKLE_FILE, "rb") as f:
            params = pickle.load(f)
        data = NCFDataset(train_file=train_file)
        self.model = NCF(
            n_users=data.n_users, 
            n_items=data.n_items,
            model_type=params['model_type'],
            n_factors=params['n_factors'],
            layer_sizes=params['layer_sizes'],
            n_epochs=params['n_epochs'],
            batch_size=params['batch_size'],
            learning_rate=params['learning_rate'],
            verbose=10,
            seed=params['seed']
        )
        self.model.set_dict(data)
        self.model.load(neumf_dir="ncf_model")

    def predict(self, item_id):
        """ Predict the rating for a given item_id for the user_id.
        :param item_id: The ID of the item to predict the rating for.
        :return: Predicted rating for the item. e.g. 0.936399
        """
        # Assuming the model has a method to predict ratings
        if self.model is None:
            self.load_model()
        assert self.model is not None  # Type assertion for linter
        return self.model.predict(self.user_id, item_id)
        
    def recommend(self, top_n=10):
        """ Recommend top_n items for the user_id.
        :param top_n: Number of items to recommend.
        :return: DataFrame with recommended items and their predicted ratings.
        """
        # Assuming the model has a method to recommend items
        items = list(train.movie_id.unique())
        all_predictions = pd.DataFrame(data={"movie_id": [], "prediction": []})
        for movie in items:
            prediction = self.predict(movie)
            all_predictions.loc[-1] = [movie, prediction]
            all_predictions.index = all_predictions.index + 1 # shift index
        all_predictions = all_predictions.sort_values(by='prediction', ascending=False) 

        return self.format_response(all_predictions, top_n)
           
    def format_response(self, all_predictions, top_n=10):
        """ Format the recommendations into a response dictionary.
        :param recommendations: DataFrame with recommended items and their predicted ratings.
        :return: Dictionary with user_id and recommended movies.
        """
        all_predictions = pd.DataFrame.from_dict(all_predictions)
        recommended_movies = all_predictions.copy()
        recommended_movies = recommended_movies.rename(columns={'movie_id': 'movie_id', 'prediction': 'prediction'})
        recommended_movies = recommended_movies.merge(movie_df[['movie_id', 'title']], on='movie_id', how='left')
        # Ensure that the 'title' column is present
        # Sort by prediction score
        recommended_movies = recommended_movies.sort_values(by='prediction', ascending=False)
        # Filter out movies that the user has already watched
        movies_watched = list(df[df['user_id'] == self.user_id]['title'])
        print(f"Movies watched by user count {self.user_id}: {len(movies_watched)}")
        recommended_movies = recommended_movies[~recommended_movies['title'].isin(movies_watched)]
        # Limit to top_n recommendations
        recommended_movies = recommended_movies.head(top_n)
        print(f"top 10 Recommended movies for user {self.user_id}:")
        print(recommended_movies.head(10))
        # map to array of objects with id and title
        recommended_movies = recommended_movies[['movie_id', 'title']].to_dict(orient='records')
        return {
            'user_id': self.user_id,
            'recommended_movies': recommended_movies,
        }