const allRoles = {
  rental: ["createTool"],
  borrower: ["getUsers", "makePayment"],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(
  Object.entries(allRoles)
);
