enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500,
}

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

type ApiEndpoint = {
  path: string;
  method: HttpMethod;
  expectedStatus: HttpStatus[];
};

const endpoints: Map<string, ApiEndpoint> = new Map([
  ["getUser", {
    path: "/users/:id",
    method: HttpMethod.GET,
    expectedStatus: [HttpStatus.OK, HttpStatus.NotFound],
  }],
  ["createUser", {
    path: "/users",
    method: HttpMethod.POST,
    expectedStatus: [HttpStatus.Created, HttpStatus.BadRequest],
  }],
  ["updateUser", {
    path: "/users/:id",
    method: HttpMethod.PUT,
    expectedStatus: [HttpStatus.OK, HttpStatus.NotFound, HttpStatus.BadRequest],
  }],
  ["deleteUser", {
    path: "/users/:id",
    method: HttpMethod.DELETE,
    expectedStatus: [HttpStatus.OK, HttpStatus.NotFound],
  }],
]);

const statusMessages: Record<HttpStatus, string> = {
  [HttpStatus.OK]: "Request successful",
  [HttpStatus.Created]: "Resource created successfully",
  [HttpStatus.BadRequest]: "Invalid request data",
  [HttpStatus.Unauthorized]: "Authentication required",
  [HttpStatus.NotFound]: "Resource not found",
  [HttpStatus.InternalServerError]: "Server error occurred",
};

const allowedMethods: Set<HttpMethod> = new Set([
  HttpMethod.GET,
  HttpMethod.POST,
  HttpMethod.PUT,
  HttpMethod.DELETE,
]);

function validateResponse(status: HttpStatus, method: HttpMethod): boolean {
  const successStatuses = [HttpStatus.OK, HttpStatus.Created];
  const errorStatuses = [
    HttpStatus.BadRequest,
    HttpStatus.Unauthorized,
    HttpStatus.NotFound,
    HttpStatus.InternalServerError,
  ];

  return [...successStatuses, ...errorStatuses].includes(status) &&
    allowedMethods.has(method);
}

class ApiClient {
  private requestHistory: Array<{
    method: HttpMethod;
    status: HttpStatus;
    timestamp: Date;
  }> = [];

  private async makeRequest(method: HttpMethod): Promise<HttpStatus> {
    // Simulate API call
    const statuses = Object.values(HttpStatus).filter(
      (s): s is HttpStatus => typeof s === "number",
    );
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    this.requestHistory.push({
      method,
      status: randomStatus,
      timestamp: new Date(),
    });

    return randomStatus;
  }

  async get(): Promise<HttpStatus> {
    return this.makeRequest(HttpMethod.GET);
  }

  async post(): Promise<HttpStatus> {
    return this.makeRequest(HttpMethod.POST);
  }

  getRequestStats(): Record<HttpMethod, number> {
    const stats: Record<HttpMethod, number> = {
      [HttpMethod.GET]: 0,
      [HttpMethod.POST]: 0,
      [HttpMethod.PUT]: 0,
      [HttpMethod.DELETE]: 0,
      [HttpMethod.PATCH]: 0,
    };

    for (const request of this.requestHistory) {
      stats[request.method]++;
    }

    return stats;
  }
}
