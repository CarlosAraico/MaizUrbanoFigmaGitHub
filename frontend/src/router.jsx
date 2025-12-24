import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { LoginPage } from "./pages/Login";
import { HomePage } from "./pages/Home";
import { MenuListPage } from "./pages/admin/MenuList";
import { MenuCreatePage } from "./pages/admin/MenuCreate";
import { MenuEditPage } from "./pages/admin/MenuEdit";
import { AdminDashboardPage } from "./pages/admin/AdminDashboard";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin", element: <AdminDashboardPage /> },
          { path: "/admin/menu", element: <MenuListPage /> },
          { path: "/admin/menu/new", element: <MenuCreatePage /> },
          { path: "/admin/menu/:id/edit", element: <MenuEditPage /> }
        ]
      }
    ]
  }
]);
