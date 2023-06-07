import fetch from "node-fetch";
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
import { writeToFile } from "./writeToFile.js";
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
    if (debugMode) {
      console.log("Error fetching group");
      console.log({ groupId });

      console.log(JSON.stringify(res.errors));
    }
  } else {
    const groupUserIds =
      res.data.actor.organization.userManagement.authenticationDomains.authenticationDomains[0].groups.groups[0].users.users.map(
        (u) => u.id
      );
    // console.log(JSON.stringify(groupUserIds));
    return groupUserIds;
  }
};
/*
 *
 * New Relic imposes a limit on the amount of users you can add to a group in a single request, which is 50
 * This splices the user ID's into chunks of length 50 and makes those requests
 */
const chunkUsers = async ({ nrak, groupId, userIds }) => {
  const groupUsers = await getGroup(nrak, groupId);
  const filteredUserIds = userIds.filter((u) => !groupUsers.includes(u));
  // console.log(filteredUserIds)
  let verifyResults = [];
  const chunkNumber = filteredUserIds.length / 50;
  for (var j = 1; j <= chunkNumber + 1; j++) {
    const userChunk = filteredUserIds.slice(0, 49);
    const result = await addUsersToGroup({
      nrak,
      groupId,
      userIds: userChunk,
    });
    verifyResults = verifyResults.concat(result);
    filteredUserIds.splice(0, 49);
  }

  if (verifyResults.some((res) => !res)) {
    console.log("there was an error with ", groupId);
  } else {
    console.log(`Users added to group id: ${groupId}`);
    completeGroups.push(groupId);
    writeToFile({
      content: JSON.stringify(completeGroups),
      filename: "./complete-groups.json",
    });
  }
};

const addUsersToGroup = async ({ nrak, groupId, userIds }) => {
  // console.log(`Adding users to group id: ${groupId}`);
  let verified;
  if (groupId && userIds.length > 0) {
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
      if (debugMode) {
        console.log("Error assigning users to group");

        console.log({ groupId, userIds });
        console.log(JSON.stringify(result));
      }
      verified = false;
    } else {
      verified = true;
    }
  } else {
    verified = true;
  }
  return verified;
};
const createGroups = async (nrak, groupId) => {
  const result = await fetch("https://api.newrelic.com/graphql", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "API-Key": nrak,
      json: true, // notice the Bearer before your token
    },
    body: JSON.stringify({
      query: getGroupQuery,
      variables: {
        authDomain: domainId,
        groupId,
      },
    }),
  });
  const res = await result.json();
  if (res.errors) {
    if (debugMode) {
      console.log("Error fetching group");
      console.log({ groupId });

      console.log(JSON.stringify(res.errors));
    }
  } else {
    const groupUserIds =
      res.data.actor.organization.userManagement.authenticationDomains.authenticationDomains[0].groups.groups[0].users.users.map(
        (u) => u.id
      );
    // console.log(JSON.stringify(groupUserIds));
    return groupUserIds;
  }
};

const createGroups = async (groups) => {
  const uniqueGroups = [];
  groups.forEach(({ Groups }) => {
    Groups.split(",").forEach((gr) => {
      if (uniqueGroups.indexOf(gr) === -1) {
        uniqueGroups.push(gr);
      }
    });
  });
  console.log(uniqueGroups);
  return uniqueGroups;
};
async function main() {
  const domainId = "123456";
  const groupName = "test-group";
  const uniqueGroups = createGroup({ domainId, groupName, nrak })
}

main();
