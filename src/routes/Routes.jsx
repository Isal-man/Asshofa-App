import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "../components";
import { DashboardPage, JadwalPengajaranPage, LoginPage, PengajarPage, RegisterPage, SantriPage, WaliSantriPage } from "../pages";
import { useEffect } from "react";

const Routes = () => {

  useEffect(() => {
    console.log(router.routes, "ini router");
  })

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <DashboardPage />
        },
        {
          path: "/santri",
          element: <SantriPage />,
        },
        {
          path: "/wali-santri",
          element: <WaliSantriPage />,
        },
        {
          path: "/pengajar",
          element: <PengajarPage />,
        },
        {
          path: "/jadwal",
          element: <JadwalPengajaranPage />,
        },
      ],
    },
  ];

  // Define routes accessible only for not-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ];

  // Combine and conditionally include routes based on authenticated status
  const router = createBrowserRouter([
    ...routesForAuthenticatedOnly,
    ...routesForNotAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;