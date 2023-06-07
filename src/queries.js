export const getAccessGroupsQuery = `query accessGroupQuery($authDomain: [ID!]!,$cursor: String){
  actor {
    organization {
      userManagement {
        authenticationDomains(id: $authDomain) {
          authenticationDomains {
            groups(cursor: $cursor) {
              groups {
                users {
                  users {
                    id
                    email
                    name
                    timeZone
                  }
                  
                }
                id
                displayName
              }
              nextCursor
            }
            id
            name
          }
        }
      }
    }
  }
}`;

export const grantAccessToGroupMutation = `mutation grantAccessToGroup($groupId: ID!, $accountId: Int!, $roleId: ID!) {
  authorizationManagementGrantAccess(grantAccessOptions: {groupId: $groupId, accountAccessGrants: {accountId: $accountId, roleId: $roleId}}) {
    roles {
      displayName
      accountId
    }
  }
}`
export const getRolesQuery = `query getAllRoles($domainId: [ID!]!){
  actor {
    organization {
      authorizationManagement {
        authenticationDomains(id: $domainId) {
          authenticationDomains {
            groups {
              groups {
                roles {
                  roles {
                    accountId
                    displayName
                    id
                    name
                    organizationId
                    type
                  }
                }
              }
            }
          }
        }
      }
    }
  }}`
export const getUsersQuery = `query userQuery($authDomain: [ID!]!,$cursor: String) {
  actor {
    organization {
      userManagement {
        authenticationDomains(id: $authDomain) {
          authenticationDomains {
            users(cursor: $cursor) {
              users {
                id
                email
                name
                timeZone
              }
              nextCursor
            }
            name
          }
        }
      }
    }
  }
}`;

export const addUsersToGroupQuery = `mutation mutateUserGroups($groupIds: [ID!]!, $userIds:[ID!]!) {
  userManagementAddUsersToGroups(addUsersToGroupsOptions: {groupIds: $groupIds, userIds: $userIds}) {
    groups {
      displayName
      id
    }
  }
}`;
export const createAccessGroupMutation = `mutation createAccessGroup($authDomain: ID!, $displayName:String!) {
  userManagementCreateGroup(createGroupOptions: {authenticationDomainId: $authDomain, displayName: $displayName}) {
    group {
      displayName
      id
    }
  }
}`;
export const deleteGroupMutation = `mutation deleteAccessGroup($groupId: String!){
  userManagementDeleteGroup(groupOptions: {id: $groupId}) {
    group {
      id
    }
  }
}`;
export const getGroupQuery = `query getGroupUser($authDomain: [ID!]!,$groupId: [ID!]!) {
  actor {
    organization {
      userManagement {
        authenticationDomains(id: $authDomain) {
          authenticationDomains {
            groups(id: $groupId) {
              groups {
                users {
                  users {
                    id
                  }
                }
                id
                displayName
              }
            }
            id
            name
          }
        }
      }
    }
  }
}`;
