const HttpStatus = {
  OK: 200,
  Created: 201,
  BadRequest: 400,
  Unauthorized: 401,
  NotFound: 404,
  InternalServerError: 500,
} as const;
type HttpStatusType = typeof HttpStatus[keyof typeof HttpStatus];

const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
} as const;
type HttpMethodType = typeof HttpMethod[keyof typeof HttpMethod];

type ApiEndpoint = {
  path: string;
  method: HttpMethodType;
  expectedStatus: HttpStatusType[];
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

const statusMessages: Record<HttpStatusType, string> = {
  [HttpStatus.OK]: "Request successful",
  [HttpStatus.Created]: "Resource created successfully",
  [HttpStatus.BadRequest]: "Invalid request data",
  [HttpStatus.Unauthorized]: "Authentication required",
  [HttpStatus.NotFound]: "Resource not found",
  [HttpStatus.InternalServerError]: "Server error occurred",
};

const allowedMethods: Set<HttpMethodType> = new Set([
  HttpMethod.GET,
  HttpMethod.POST,
  HttpMethod.PUT,
  HttpMethod.DELETE,
]);

function validateResponse(
  status: HttpStatusType,
  method: HttpMethodType,
): boolean {
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
    method: HttpMethodType;
    status: HttpStatusType;
    timestamp: Date;
  }> = [];

  private async makeRequest(method: HttpMethodType): Promise<HttpStatusType> {
    // Simulate API call
    const statuses = Object.values(HttpStatus).filter(
      (s): s is HttpStatusType => typeof s === "number",
    );
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    this.requestHistory.push({
      method,
      status: randomStatus,
      timestamp: new Date(),
    });

    return randomStatus;
  }

  async get(): Promise<HttpStatusType> {
    return this.makeRequest(HttpMethod.GET);
  }

  async post(): Promise<HttpStatusType> {
    return this.makeRequest(HttpMethod.POST);
  }

  getRequestStats(): Record<HttpMethodType, number> {
    const stats: Record<HttpMethodType, number> = {
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
