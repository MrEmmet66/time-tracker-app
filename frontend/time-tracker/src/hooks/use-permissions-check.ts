import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../utils/token";
import { PERMISSIONS } from "../constants/permissions.constants";
import { IPermission, User } from "../models/user";
import { userHasAccess } from "../utils/user";
import { PAGES } from "../constants/pages.constants";

export const usePermissionCheck = (
  requiredPermission: PERMISSIONS | PERMISSIONS[]
) => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = getToken();
      if (!token) {
        navigate(PAGES.LOGIN);
        return;
      }

      const user: User = jwtDecode(token);

      if (user) {
        const permissions: IPermission[] = JSON.parse(
          user.permissions.toString().toLowerCase()
        );
        const haveAccess = userHasAccess(permissions, requiredPermission);

        if (!haveAccess) {
          navigate(PAGES.HOME);
        }
      }
    } catch {
      navigate(PAGES.LOGIN);
    }
  }, [navigate, requiredPermission]);
};
