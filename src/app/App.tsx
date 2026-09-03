import { RouterProvider } from "react-router-dom";
import { createAppRouter } from "./router";

export function App() {
  return <RouterProvider router={createAppRouter()} />;
}
