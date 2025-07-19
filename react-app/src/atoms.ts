import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { UserList } from "./types/userList";
import { MovieList } from "./types/movieList";

// Get the list of users and movies from JSON files
import users from "./data/users.json";
import movies from "./data/movies.json";
import { KnnParams } from "./types/knn/knnParams";
import { KnnResponse } from "./types/knn/knnResponse";
import { Model } from "./types/selectedModel";
import { NcfResponse } from "./types/ncf/ncfResponse";
import { NcfParams } from "./types/ncf/ncfParams";

// Remove duplicates from movies
const uniqueMovies = Array.from(
  new Map(movies.map((movie) => [movie.id, movie])).values(),
);

export const selectedUserAtom = atom<number | null>(null);
export const showAllMoviesAtom = atom<boolean>(false);
export const userListAtom = atom(users as UserList);
export const movieListAtom = atom(uniqueMovies as MovieList); // This atom holds the filtered movie list based on recommendations
export const selectedModelAtom = atom<Model>("knn");

export const modelInputAtom = atom<KnnParams | NcfParams | null>(null);

export const recommendedMoviesAtom = atom((get) => {
  const selectedModel = get(selectedModelAtom);
  if (selectedModel === "knn") {
    return get(knnRecommendedMoviesAtom);
  } else if (selectedModel === "ncf") {
    return get(ncfRecommendedMoviesAtom);
  }
  return undefined;
});

export const knnRecommendedMoviesAtom = atomWithQuery((get) => {
  const input = get(modelInputAtom) as KnnParams | null;
  if (!input) {
    return {
      queryKey: ["recommended-movies/knn", null],
      queryFn: async (): Promise<KnnResponse | undefined> => {
        return undefined; // Return undefined if no input is provided
      },
    };
  }

  return {
    queryKey: ["recommended-movies/knn", JSON.stringify(input)],
    queryFn: async (): Promise<KnnResponse | undefined> => {
      const response = await fetch(
        "http://localhost:5000/recommend-movies/knn",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        },
      );
      const json: KnnResponse = await response.json();
      return json;
    },
  };
});

export const ncfRecommendedMoviesAtom = atomWithQuery((get) => {
  const input = get(modelInputAtom) as NcfParams | null;
  if (!input) {
    return {
      queryKey: ["recommended-movies/ncf", null],
      queryFn: async (): Promise<NcfResponse | undefined> => {
        return undefined; // Return undefined if no input is provided
      },
    };
  }

  return {
    queryKey: ["recommended-movies/ncf", JSON.stringify(input)],
    queryFn: async (): Promise<NcfResponse | undefined> => {
      const response = await fetch(
        "http://localhost:5000/recommend-movies/ncf",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        },
      );
      const json: NcfResponse = await response.json();
      console.log("NCF Response:", json);
      return json;
    },
  };
});