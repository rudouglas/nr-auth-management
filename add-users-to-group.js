import fetch from "node-fetch";
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
import { writeToFile } from "./writeToFile.js";
import { addUsersToGroupQuery } from "./src/queries.js";

/*
 *
 * New Relic imposes a limit on the amount of users you can add to a group in a single request, which is 50
 * This splices the user ID's into chunks of length 50 and makes those requests
 */
const chunkUsers = async ({ group: {groupId, userIds}, nrak }) => {
  const chunkNumber = userIds.length / 50;
  const groupResults = [];
  for (var j = 1; j <= chunkNumber + 1; j++) {
    const userChunk = userIds.slice(0, 49);
    const result = await addUsersToGroup({
      nrak,
      groupId,
      userIds: userChunk,
    });
    groupResults.push(result);
    userIds.splice(0, 49);
  }
  return groupResults;
};

const addUsersToGroup = async ({ nrak, groupId, userIds }) => {
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
        groupIds: [groupId],
        userIds: userIds,
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
  const groups = [{ groupId: "group1", userIds: ["user1", "user2"] },{ groupId: "group2", userIds: ["user1", "user2"] }];
  const addedUsers = groups.map(async (group) => {
    const result = await chunkUsers({ group, nrak });
    return result;
  });
  writeToFile({
    content: JSON.stringify(addedUsers),
    filename: "./groups-with-users.json",
  });
}

main();
