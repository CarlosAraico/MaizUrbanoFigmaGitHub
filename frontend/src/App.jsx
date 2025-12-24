import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Hero from "./components/Hero";
import Solutions from "./components/Solutions";
import Stats from "./components/Stats";
import Markets from "./components/Markets";
import Purpose from "./components/Purpose";
import Footer from "./components/Footer";
import { Login } from "./pages/Login";
import { AdminHome } from "./pages/AdminHome";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MenuListPage } from "./pages/Admin/MenuList";
import { MenuCreatePage } from "./pages/Admin/MenuCreate";
import { MenuEditPage } from "./pages/Admin/MenuEdit";

function Landing() {
  return (
    <div className="bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <div className="page-shell py-12">
        <Hero />
      </div>
      <Solutions />
      <Stats />
      <Markets />
      <Purpose />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/menu"
        element={
          <ProtectedRoute roles={["ADMIN", "DIRECTOR"]}>
            <MenuListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/menu/new"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <MenuCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/menu/:id/edit"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <MenuEditPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
