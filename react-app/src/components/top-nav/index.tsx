
import { useAtom } from "jotai";
import { selectedModelAtom } from "../../atoms";
import classes from "./index.module.scss";
import { FormControl, MenuItem, Select } from "@mui/material";

const TopNav = () => {
  const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);
  return (
    <div className={classes.topNavContainer}>
      <a className={classes.logoLink}>
        <span className={classes.logoText}>Movie Recommender</span>
      </a>
      <div className={classes.navLinks}>
        {/* Select Box to select model. Update state based on selection. Use jotai atom to manage state. Use MUI Select component */}
        <FormControl className={classes.modelSelect}>
          <Select
            labelId="model-select-label"
            value={selectedModel}
            className={classes.modelSelectInput}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <MenuItem value="knn">KNN</MenuItem>
            <MenuItem value="ncf">NCF</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default TopNav;
