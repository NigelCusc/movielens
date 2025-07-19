import React from "react";
// use MUI
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { formatDate } from "../../utils/dateUtils";
import { getImageUrl } from "../../utils/imageUtils";
import classes from "./index.module.scss";
import { MovieThumbnail as MovieThumbnailProps } from "../../types/movieThumbnail";

const MovieThumbnail: React.FC<MovieThumbnailProps> = ({
  movie_id: id,
  title,
  overview,
  release_date,
  adult,
  popularity,
  vote_average,
}) => {
  return (
    <Card className={classes.movieThumbnail}>
      <CardMedia
        component="img"
        image={getImageUrl(id)}
        alt={title || "Movie Poster"}
        className={classes.movieThumbnailImage}
      />
      <CardContent>
        <Typography variant="h6" component="div" className={classes.movieTitle}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.movieOverview}
        >
          {overview}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.movieDetails}
        >
          {formatDate(release_date)} | {adult === "True" ? "Adult" : "General"} |
          Popularity: {popularity} | Rating: {vote_average}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default MovieThumbnail;
