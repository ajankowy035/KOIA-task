import React from "react";
import { Box, Link, List, ListItem, Typography } from "@mui/material";

export const SearchHistory: React.FC = () => {
  const localKeys = Object.keys(localStorage);
  const formattedLocalData = localKeys
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => {
      const date = new Date(Number(key));
      const hours =
        date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
      const minutes =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      return {
        key,
        date: {
          localeString: new Date(Number(key)).toLocaleDateString(),
          hours,
          minutes,
        },
        value: localStorage.getItem(key),
      };
    });

  return (
    <Box mt={2}>
      <List>
        {formattedLocalData.map((item) => (
          <ListItem key={item.key}>
            <Box display="flex" gap={5}>
              <Typography fontWeight="bold">
                {item.date.localeString} {item.date.hours}:{item.date.minutes}
              </Typography>
              <Typography>
                <Link href={item.value || "#"}>{item.value}</Link>
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
