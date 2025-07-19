import React from "react";
import UserList from "./components/user-list";
import TopNav from "./components/top-nav";
import MovieList from "./components/movie-list";
import classes from "./App.module.scss";

function App() {
  return (
    <div className={classes.app}>
      <UserList />
      <div className={classes.mainContainer}>
        <TopNav />
        <MovieList />
      </div>
    </div>
  );
}

export default App;
