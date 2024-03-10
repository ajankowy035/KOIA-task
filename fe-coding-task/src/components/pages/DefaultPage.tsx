import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getChartData } from "../../api";
import { ApiChartResponse } from "../../api/types";
import { Footer, StyledBox } from "../atoms";
import { SearchForm } from "../molecules";
import { Chart } from "../organisms";

const DefaultPage = () => {
  const [chartData, setChartData] = useState<ApiChartResponse | null>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const houseTypeQuery = searchParams.get("houseType");
  const quartersQuery = searchParams.get("quarters");

  const parseQuarters = (value: string) =>
    value.toUpperCase().replace(/\s+/g, "").trim().split(",");

  useEffect(() => {
    if (houseTypeQuery && quartersQuery) {
      getChartData({
        houseType: houseTypeQuery,
        quarters: parseQuarters(quartersQuery),
      }).then((data) => setChartData(data));
    }
    return () => {
      setChartData(null);
    };
  }, []);

  const onFormSubmit = async ({
    houseType,
    quarters,
  }: {
    houseType: string;
    quarters: string;
  }) => {
    const data = await getChartData({
      houseType,
      quarters: parseQuarters(quarters),
    });
    if (data) {
      setChartData(data);
    }
    searchParams.set("houseType", houseType);
    searchParams.set("quarters", quarters);
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${searchParams.toString()}`
    );
  };

  return (
    <StyledBox>
      <SearchForm
        onFormSubmit={onFormSubmit}
        initialValues={{
          houseType: houseTypeQuery || "",
          quarters: quartersQuery || "",
        }}
      />
      {!chartData && "Here will be displayed a chart"}
      {chartData && <Chart data={chartData} />}
      <Footer />
    </StyledBox>
  );
};

export default DefaultPage;
