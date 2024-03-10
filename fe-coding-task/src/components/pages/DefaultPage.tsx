import { useState } from "react";
import { Footer, StyledBox } from "../atoms";
import { SearchForm } from "../molecules";
import { Chart } from "../organisms";

const DefaultPage = () => {
  const [chartData, setChartData] = useState();

  const onFormSubmit = (data: any) => {
    setChartData(data);
    console.log({ chartData });
  };

  return (
    <StyledBox>
      <SearchForm onFormSubmit={onFormSubmit} />
      <Chart />
      <Footer />
    </StyledBox>
  );
};

export default DefaultPage;
