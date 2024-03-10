import React from "react";
import { Typography, Link } from "@mui/material";
import { Box } from "@mui/system";

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#f5f5f5",
        padding: "10px",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="textSecondary" align="center">
        {"Made with ❤️ by "}
        <Link
          color="inherit"
          href="https://www.linkedin.com/in/agnieszka-jankowy-9883771a8/"
        >
          Agnieszka Jankowy
        </Link>
      </Typography>
    </Box>
  );
};
