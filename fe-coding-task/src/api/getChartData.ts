import axios from "axios";
import { ApiChartResponse } from "./types";

export const getChartData = async ({
  houseType,
  quarters,
}: {
  houseType: string;
  quarters: string[];
}): Promise<ApiChartResponse | undefined> => {
  const BASE_URL = "https://data.ssb.no/api/v0/no/table/07241";
  try {
    const response = await axios.post(BASE_URL, {
      query: [
        {
          code: "Boligtype",
          selection: {
            filter: "item",
            values: [houseType],
          },
        },
        {
          code: "ContentsCode",
          selection: {
            filter: "item",
            values: ["KvPris"],
          },
        },
        {
          code: "Tid",
          selection: {
            filter: "item",
            values: quarters,
          },
        },
      ],
      response: {
        format: "json-stat2",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
