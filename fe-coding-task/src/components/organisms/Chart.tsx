import React from "react";
import { Box } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { ApiChartResponse } from "../../api/types";

type ChartParams = {
  data: ApiChartResponse;
};

export const Chart: React.FC<ChartParams> = ({ data }) => {
  const keys = Object.keys(data.dimension.Tid.category.index);

  return (
    <Box mt={2} marginBottom={5}>
      <LineChart
        xAxis={[{ scaleType: "point", data: keys }]}
        series={[{ data: data.value }]}
        width={600}
        height={300}
      />
    </Box>
  );
};
