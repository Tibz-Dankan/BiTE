import { Route } from "react-router-dom";
import type { TPage } from "../types/routes";

export const renderRoutes = (pages: TPage[]): React.ReactElement[] => {
  return pages.map((page, index) => {
    if (page.children && page.children.length > 0) {
      return (
        <Route key={index} path={page.path} element={page.element}>
          {renderRoutes(page.children)}
        </Route>
      );
    }
    return <Route key={index} path={page.path} element={page.element} />;
  });
};
