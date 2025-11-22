import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import  { Toaster } from 'react-hot-toast';

import { RouterProvider } from "react-router";
import { router } from "./router/index.tsx";
import { store } from "./redux/store.ts";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster/>
    </Provider>
  </StrictMode>
);
