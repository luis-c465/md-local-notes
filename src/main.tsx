import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultRoute from "~/routes/default";
import ErrorRoute from "~/routes/error";
import NoteRoute from "~/routes/note";
import Root from "~/routes/root";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "note/:noteId",
        element: <NoteRoute />,
        errorElement: <ErrorRoute />,
      },
      {
        path: "/",
        element: <DefaultRoute />,
        errorElement: <ErrorRoute />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
