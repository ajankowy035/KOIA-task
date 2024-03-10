import { useState } from "react";
import { getChartData } from "../../api";
import { ApiChartResponse } from "../../api/types";
import { Footer, StyledBox } from "../atoms";
import { SearchForm } from "../molecules";
import { Chart } from "../organisms";

const DefaultPage = () => {
  const [chartData, setChartData] = useState<ApiChartResponse>();

  const onFormSubmit = async ({
    houseType,
    quarters,
  }: {
    houseType: string;
    quarters: string;
  }) => {
    const parsedQuarters = quarters
      .toUpperCase()
      .replace(/\s+/g, "")
      .trim()
      .split(",");

    const data = await getChartData({
      houseType,
      quarters: parsedQuarters,
    });
    if (data) {
      setChartData(data);
    }
  };

  return (
    <StyledBox>
      <SearchForm onFormSubmit={onFormSubmit} />
      {!chartData && "Here will be displayed a chart"}
      {chartData && <Chart data={chartData} />}
      <Footer />
    </StyledBox>
  );
};

export default DefaultPage;
