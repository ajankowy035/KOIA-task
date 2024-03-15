import { Button, Link, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getChartData } from "../../api";
import { ApiChartResponse } from "../../api/types";
import { Footer, StyledBox } from "../atoms";
import { SearchForm } from "../molecules";
import { Chart } from "../organisms";

const DefaultPage = () => {
  const [chartData, setChartData] = useState<ApiChartResponse | null>();
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const houseTypeQuery = searchParams.get("houseType");
  const quartersQuery = searchParams.get("quarters");

  const parseQuarters = (value: string) =>
    value.toUpperCase().replace(/\s+/g, "").trim().split(",");

  useEffect(() => {
    setError(null);

    if (houseTypeQuery && quartersQuery) {
      getChartData({
        houseType: houseTypeQuery,
        quarters: parseQuarters(quartersQuery),
      })
        .then((data) => setChartData(data))
        .catch((_) => {
          setError("Error fetching data. Please try again.");
        });
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
    setError(null);
    setChartData(null);

    const data = await getChartData({
      houseType,
      quarters: parseQuarters(quarters),
    }).catch((_) => {
      setError("Error fetching data. Please try again.");
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

  const saveSearchEntryInLocalStorage = () => {
    localStorage.setItem(new Date().getTime().toString(), window.location.href);
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
      {error && <Typography color="error">{error}</Typography>}

      {!chartData && "Here will be displayed a chart"}
      {chartData && <Chart data={chartData} />}
      {chartData && (
        <Button variant="outlined" onClick={saveSearchEntryInLocalStorage}>
          Save Search Entry
        </Button>
      )}
      <Link sx={{ marginTop: 5, fontSize: "14px" }} href="/history">
        Search History
      </Link>
      <Footer />
    </StyledBox>
  );
};

export default DefaultPage;
