enum Status {
  Pending = 0,
  Active = 1,
  Inactive = 2,
}

interface User {
  name: string;
  status: Status;
}

function createUser(name: string): User {
  return {
    name,
    status: Status.Pending,
  };
}
