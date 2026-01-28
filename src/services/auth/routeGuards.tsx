import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSession } from "./session";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = getSession();
  const location = useLocation();

  if (isLoading) return null; // or a loader
  if (!data?.authenticated) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}

export function RequireGuest({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = getSession();

  if (isLoading) return null;
  if (data?.authenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}