class Configuration {
  constructor(readonly apiKey: string, readonly baseUrl: string) {}

  getApiKey(): string {
    return this.apiKey;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}
