import { StyledBox } from "../atoms";
import { SearchForm } from "../molecules";
import { Chart } from "../organisms";

const DefaultPage = () => {
  return (
    <StyledBox>
      <SearchForm />
      <Chart />
    </StyledBox>
  );
};

export default DefaultPage;
