import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

export const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Norway Statistics</Typography>
      </Toolbar>
    </AppBar>
  );
};
