import * as Roles from "./Roles";

const authorize = (user, ...rolesArray) => {
  let userRoles = user.Roles || [];
  let result = userRoles.some((role) => {
    return rolesArray.includes(role.RoleName);
  });

  return result;
};

export { Roles, authorize };
