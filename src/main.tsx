import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GoogleCallback from "./components/GoogleCallback";
// import { AuthProvider } from "../src/context/AuthContext";
// import Dashboard from "./pages/Dashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import WhiteboardPage from "./pages/WhiteBoardPage";
// import ProtectedRoute from "./components/ProtectedRoute";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <LandingPage />,
//   },
//   // {
//   //   element: <ProtectedRoute />,
//   //   children: [
//   //     {
//   //       path: "/dashboard",
//   //       element: <Dashboard />,
//   //     },
//   //   ],
//   // },
// ]);

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/dashboard",
    // element: <ProtectedRoute>{/* <Dashboard /> */}</ProtectedRoute>,
    element: <Dashboard />,
  },
  {
    path: "/auth/google/callback",
    element: <GoogleCallback />,
  },
  {
    path: "/canvas/:canvasId",
    // element: <ProtectedRoute>{/* <Canvas /> */}</ProtectedRoute>,
    element: <WhiteboardPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <AuthProvider> */}
    <RouterProvider router={router} />
    {/* </AuthProvider> */}
  </StrictMode>
);
