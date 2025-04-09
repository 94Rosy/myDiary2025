import { CircularProgress } from "@mui/material";
import "./emptyScreen.scss";

const EmptyScreen = () => (
  <div className="empty__wrapper">
    <div className="loading__wrapper">
      <CircularProgress sx={{ color: "var(--primary-color)" }} />
    </div>
  </div>
);

export default EmptyScreen;
