const allRoles = {
  client: ["common", "user"],
  admin: ["common", "admin"],
  admin: ["common", "superAdmin"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
