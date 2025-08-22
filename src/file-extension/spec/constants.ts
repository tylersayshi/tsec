export const API_VERSION = "v1";
export const DEFAULT_PORT = 3000;
export const MAX_RETRY_ATTEMPTS = 3;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export class Constants {
  static readonly API_VERSION = API_VERSION;
  static readonly DEFAULT_PORT = DEFAULT_PORT;
  static readonly MAX_RETRY_ATTEMPTS = MAX_RETRY_ATTEMPTS;
}