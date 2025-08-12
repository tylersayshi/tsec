class Settings {
  public theme: string;
  public language: string;
  private debug: boolean;

  constructor(
    theme: string = "dark",
    language: string = "en",
    debug: boolean = false,
  ) {
    this.theme = theme;
    this.language = language;
    this.debug = debug;
  }

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
