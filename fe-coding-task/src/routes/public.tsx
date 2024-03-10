import React from "react";
import { Routes, Route } from "react-router-dom";
import { RoutesDefinition } from "./types";

const DefaultPage = React.lazy(() => import("../components/pages/DefaultPage"));
const HistoryPage = React.lazy(() => import("../components/pages/HistoryPage"));

const PublicRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path={RoutesDefinition.default} element={<DefaultPage />} />
      <Route path={RoutesDefinition.history} element={<HistoryPage />} />
    </Routes>
  );
};
export default PublicRoutes;
