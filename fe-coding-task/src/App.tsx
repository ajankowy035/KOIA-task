import React from "react";
import { CircularProgress } from "@mui/material";

const PublicRoutes = React.lazy(() => import("./routes/public"));

const App: React.FC = () => {
  return (
    <React.Suspense fallback={<CircularProgress />}>
      <PublicRoutes />
    </React.Suspense>
  );
};

export default App;
