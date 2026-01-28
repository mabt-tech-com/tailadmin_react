import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useLogout } from "../../hooks/useAuth";

export default function Logout() {
  const nav = useNavigate();
  const { logout } = useLogout();

  useEffect(() => {
    (async () => {
      const res = await logout();
      if (res.ok) nav(res.redirect);
      else nav("/signin");
    })();
  }, [logout, nav]);

  return null;
}