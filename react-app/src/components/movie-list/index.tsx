import classes from "./index.module.scss";
import React, { useEffect } from "react";
import MovieThumbnail from "../movie-thumbnail";
import { useAtom } from "jotai";
import {
  movieListAtom,
  recommendedMoviesAtom,
  showAllMoviesAtom,
} from "../../atoms";
import movies from "../../data/movies.json";
import { MovieList as MovieListType } from "../../types/movieList";

const MovieList = () => {
  // get movie list from the server
  const [movieList, setMovieList] = useAtom(movieListAtom);
  const [recommendedMovies] = useAtom(recommendedMoviesAtom);
  const [showAllMovies] = useAtom(showAllMoviesAtom);
  // Add loading state to show spinner when a new user or algorithm is selected
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    // If showAllMovies is true, we are not loading recommendations
    if (showAllMovies) {
      setLoading(false);
      return;
    }
    // If recommendedMovies is undefined or null, we are loading
    if (!recommendedMovies || !recommendedMovies.data) {
      setLoading(true);
      return;
    }
    setLoading(false);
  }, [recommendedMovies, showAllMovies]);


  useEffect(() => {
    // If showAllMovies is true, we should not filter the movie list
    if (showAllMovies) {
      // Reset
      setMovieList(movies as MovieListType);
      return;
    }
    // If showAllMovies is false, we should filter the movie list based on recommended movies
    const recMovies = recommendedMovies?.data?.recommended_movies || [];
    if (recMovies.length !== 0) {
      // Filter the movie list to only include recommended movies
      const temp = movies.filter((movie) =>
        recMovies.some((recMovie) => recMovie.movie_id === movie.movie_id),
      );
      setMovieList(temp as MovieListType);
      return;
    }
  }, [showAllMovies, recommendedMovies]);

  return (
    <div className={classes.movieListContainer}>
      {loading && <div className={classes.loading}>Loading...</div>}
      {!loading && movieList.length === 0 && <div className={classes.loading}>No movies found</div>}
      {!loading && movieList.length > 0 && (
        <div className={classes.movieList}>
          {movieList.map((movie) => (
          <MovieThumbnail
            movie_id={movie.movie_id}
            title={movie.title}
            overview={movie.overview}
            genres={movie.genres}
            release_date={movie.release_date}
            adult={movie.adult}
            popularity={movie.popularity}
            vote_average={movie.vote_average}
          />
          ))}
        </div>
      )}
    </div>
  );
};
export default MovieList;
