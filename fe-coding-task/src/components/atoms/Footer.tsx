import React from "react";
import { Typography, Link } from "@mui/material";

export const Footer: React.FC = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Made with ❤️ by "}
      <Link
        color="inherit"
        href="https://www.linkedin.com/in/agnieszka-jankowy-9883771a8/"
      >
        Agnieszka Jankowy
      </Link>
    </Typography>
  );
};
