class Settings {
  constructor(
    public theme: string = "dark",
    public language: string = "en",
    private debug: boolean = false,
  ) {}

  getTheme(): string {
    return this.theme;
  }

  getLanguage(): string {
    return this.language;
  }

  isDebug(): boolean {
    return this.debug;
  }
}
