import fetch from "node-fetch";
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
import { writeToFile } from "./write-fo-file.js";
import { createAccessGroupMutation, getGroupQuery } from "./src/queries.js";

/*
 *
 * Fetches information a specific group and returns the User ID's in that group
 */
const createGroup = async ({ domainId, groupName, nrak }) => {
  const result = await fetch("https://api.newrelic.com/graphql", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "API-Key": nrak,
      json: true, // notice the Bearer before your token
    },
    body: JSON.stringify({
      query: createAccessGroupMutation,
      variables: {
        authDomain: domainId,
        groupName,
      },
    }),
  });
  const res = await result.json();
  if (res.errors) {
    console.log("Error fetching group");
    return res.errors;
  }
  return res.data;
};

const createGroups = async ({ domainId, groups, nrak }) => {
  const createdGroups = groups.map(async (groupName) => {
    const result = createGroup({ domainId, groupName, nrak });
    console.log(result);
    return result;
  });
  writeToFile({
    content: JSON.stringify(createdGroups),
    filename: "./created-groups.json",
  });
};

async function main() {
  const domainId = "123456";
  const nrak = "123456";
  const groups = ["test-group"];
  const uniqueGroups = await createGroups({ domainId, groups, nrak });
}

main();
