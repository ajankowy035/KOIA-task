import { Footer, StyledBox } from "../atoms";
import { SearchForm } from "../molecules";
import { Chart } from "../organisms";

const DefaultPage = () => {
  return (
    <StyledBox>
      <SearchForm />
      <Chart />
      <Footer />
    </StyledBox>
  );
};

export default DefaultPage;
