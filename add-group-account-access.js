import fetch from "node-fetch";
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
import { writeToFile } from "./writeToFile.js";
import { addUsersToGroupQuery } from "./src/queries.js";


const addAccountRoleAccessToGroup = async ({
  nrak,
  groupId,
  accountId,
  roleId,
}) => {
  const result = await fetch("https://api.newrelic.com/graphql", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "API-Key": nrak,
      json: true, // notice the Bearer before your token
    },
    body: JSON.stringify({
      query: addUsersToGroupQuery,
      variables: {
        groupId,
        accountId,
        roleId,
      },
    }),
  });
  const res = await result.json();
  if (res.errors) {
    console.log("Error assigning users to group");

    console.log(JSON.stringify(res));
  }
  return res;
};

async function main() {
  const nrak = "123456";
  const groups = [
    {
      groupId: "group1",
      accountIds: ["account1", "account2"],
      roleIds: ["role1", "role2"],
    },
    {
      groupId: "group2",
      accountIds: ["account1", "account2"],
      roleIds: ["role1", "role2"],
    },
  ];
  const addedAccess = groups.map(async ({ groupId, accountIds, roleIds }) => {
    const accountRoleAccessResults = accountIds.map(async (accountId) => {
      const accountsResult = roleIds.map(async (roleId) => {
        return await addAccountRoleAccessToGroup({
          groupId,
          accountId,
          roleId,
        });

      });
      return { accountId, accountsResult };
    });
    return { groupId, accountRoleAccessResults };
  });
  writeToFile({
    content: JSON.stringify(addedAccess),
    filename: "./groups-with-accounts-roles.json",
  });
}

main();
