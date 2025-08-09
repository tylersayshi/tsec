const Theme = {
  Light: "light",
  Dark: "dark",
  Auto: "auto",
} as const;
type ThemeType = typeof Theme[keyof typeof Theme];

const Size = {
  Small: "sm",
  Medium: "md",
  Large: "lg",
} as const;
type SizeType = typeof Size[keyof typeof Size];

interface ComponentProps {
 theme: ThemeType;
 size: SizeType;
 disabled?: boolean;
}

function createComponent({ 
 theme = Theme.Light, 
 size = Size.Medium, 
 disabled = false 
}: Partial<ComponentProps> = {}): ComponentProps {
 return { theme, size, disabled };
}

const config = {
 defaultTheme: Theme.Dark,
 availableSizes: [Size.Small, Size.Medium, Size.Large],
 themeColors: {
   [Theme.Light]: "#ffffff",
   [Theme.Dark]: "#000000",
   [Theme.Auto]: "inherit"
 }
};

const { defaultTheme, availableSizes } = config;

function handleThemeChange(newTheme: ThemeType): void {
 const themes: Record<ThemeType, () => void> = {
   [Theme.Light]: () => console.log("Switching to light theme"),
   [Theme.Dark]: () => console.log("Switching to dark theme"), 
   [Theme.Auto]: () => console.log("Using system theme")
 };
 
 themes[newTheme]?.();
}