import React from "react";
import classes from "./index.module.scss";
import { Button } from "@mui/material";
import { useAtom } from "jotai";
import {
  modelInputAtom,
  selectedUserAtom,
  showAllMoviesAtom,
  selectedModelAtom,
  userListAtom,
} from "../../atoms";

const UserList = () => {
  // Table data of users. One can be selected to view his recommended movies.
  // Option on top to show all movies.
  // store the selected user in a state variable
  const [userList] = useAtom(userListAtom);
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom);
  const [selectedModel] = useAtom(selectedModelAtom); // Assuming this is the model selection atom
  const [, setShowAllMovies] = useAtom(showAllMoviesAtom);
  const [, setmodelInput] = useAtom(modelInputAtom);

  // Example usage (e.g., after form submit)
  const handleFetch = (user_id: number) => {
    // Check which model is selected and set the input accordingly
    console.log("Fetching recommendations for user:", user_id);
    if (selectedModel === "ncf") {
      // If selected model is NCF, set input for NCF model
      console.log("Selected model is NCF");
      // Set input for NCF model
      setmodelInput({
        // model: "ncf", // Assuming "ncf" is the model you want to use
        n_recommendations: 10, // Example value for n_movies
        user_id,
      });
      return;
    }
    // If selected model is KNN, set input for KNN model
    console.log("Selected model is KNN");
    setmodelInput({
      // model: "knn", // Assuming "knn" is the model you want to use
      n_neighbors: 5, // Example value for n_neighbors
      n_recommendations: 10, // Example value for n_recommendations
      user_id,
    });
  };

  const handleShowAllMovies = () => {
    console.log("Showing all movies");
    setShowAllMovies(true);
    setSelectedUser(null); // Clear selected user when showing all movies
  };

  const handleUserSelection = (userId: number) => {
    setSelectedUser(userId);
    setShowAllMovies(false);
    handleFetch(userId); // Fetch recommendations for the selected user
  };

  // Use material UI table to display the user list
  return (
    <div className={classes.userListContainer}>
      <div className={classes.userListHeader}>
        <h2 className={classes.userListTitle}>User List</h2>
        <p className={classes.userListDescription}>
          Select a user to view their recommended movies. Click the button below
          to show all movies.
        </p>

        <Button
          variant="contained"
          color="primary"
          className={classes.showAllButton}
          onClick={handleShowAllMovies}
        >
          Show All Movies
        </Button>
      </div>
      <table className={classes.userListTable}>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Occupation</th>
            <th>Zip Code</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr
              key={user.user_id}
              onClick={() => handleUserSelection(user.user_id)}
              className={
                selectedUser === user.user_id ? classes.selectedRow : ""
              }
            >
              <td>{user.user_id}</td>
              <td>{user.age}</td>
              <td>{user.sex}</td>
              <td>{user.occupation}</td>
              <td>{user.zip_code}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default UserList;
