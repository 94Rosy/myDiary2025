import { CircularProgress } from "@mui/material";
import "./spinner.scss";

const Spinner = () => {
  return (
    <div className="spinner__wrapper">
      <CircularProgress sx={{ color: "var(--primary-color)" }} />
    </div>
  );
};

export default Spinner;
