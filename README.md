## Recommendation System for MovieLens Dataset 

Here I'm working on different kinds of recommendation systems for the movielens data. The following recommendation systems are implemented:
1. Cosine Similarity with KNN (User-User) (User-Based Collaborative Filtering)
2. Cosine Similarity with SVD (Matrix Factorization) (Movie-User) (User-Based Collaborative Filtering)
3. Cosine Similarity with SVD (Matrix Factorization) (Movie-Movie) (Item-Based Collaborative Filtering) 
These are based on https://github.com/rposhala/Recommender-System-on-MovieLens-dataset/blob/main/Recommender_System_using_SVD.ipynb
4. Neural Collaborative Filtering (NCF) and Matrix Factorization (MF) for recommendation systems.

I've also implemented a Flask API to serve recommendations based on user input. The frontend is built using React and communicates with the backend API to fetch movie recommendations.
<img alt="recommender app" src="https://github.com/user-attachments/assets/d4111a74-1181-4573-8e8a-d22bedae1b28" />

The backend API is structured to handle requests for movie recommendations based on user IDs and the number of movies requested. The Neural Collaborative Filtering model is used to generate these recommendations, which are then formatted and returned as a JSON response.

### Folder Structure
```
.
├── backend-api - Flask API for serving recommendations
│   ├── app.py
├── python - Python scripts for recommendation algorithm Testing
├── frontend
│   ├── package.json
│   ├── public
│   └── src
├── README.md
```

### NCF model
<img alt="ncf model" src="NCF model mermaid.png" />

### Next Steps
- Try wide and deep learning models for recommendations. Base on https://github.com/itemgiver/MovieLens/tree/main
