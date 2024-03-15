import { Link } from "@mui/material";
import { Footer, StyledBox } from "../atoms";
import { SearchHistory } from "../organisms";

const HistoryPage = () => {
  return (
    <StyledBox>
      <SearchHistory />
      <Link sx={{ marginTop: 5, fontSize: "14px" }} href="/">
        Main Page
      </Link>
      <Footer />
    </StyledBox>
  );
};

export default HistoryPage;
