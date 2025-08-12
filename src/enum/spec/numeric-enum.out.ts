const Status = {
  Pending: 0,
  Active: 1,
  Inactive: 2,
} as const;
type StatusType = typeof Status[keyof typeof Status];

interface User {
  name: string;
  status: StatusType;
}

function createUser(name: string): User {
  return {
    name,
    status: Status.Pending,
  };
}
