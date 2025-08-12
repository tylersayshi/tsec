enum ApiEndpoint {
  Users = "/api/users",
  Posts = "/api/posts",
  Comments = "/api/comments",
}

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

enum ResponseStatus {
  Success = 200,
  NotFound = 404,
  ServerError = 500,
}

interface ApiRequest {
  endpoint: ApiEndpoint;
  method: HttpMethod;
}

interface ApiResponse<T = unknown> {
  status: ResponseStatus;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async makeRequest<T>(
    endpoint: ApiEndpoint,
    method: HttpMethod = HttpMethod.GET,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, { method });

      if (response.ok) {
        const data = await response.json();
        return {
          status: ResponseStatus.Success,
          data,
        };
      } else {
        return {
          status: response.status === 404
            ? ResponseStatus.NotFound
            : ResponseStatus.ServerError,
          error: `Request failed with status ${response.status}`,
        };
      }
    } catch (error: any) {
      return {
        status: ResponseStatus.ServerError,
        error: error.message,
      };
    }
  }
}

// Usage examples
const client = new ApiClient("https://api.example.com");
const usersRequest: ApiRequest = {
  endpoint: ApiEndpoint.Users,
  method: HttpMethod.GET,
};
