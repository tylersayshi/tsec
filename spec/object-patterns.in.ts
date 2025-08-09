enum Theme {
 Light = "light",
 Dark = "dark",
 Auto = "auto"
}

enum Size {
 Small = "sm",
 Medium = "md",
 Large = "lg"
}

interface ComponentProps {
 theme: Theme;
 size: Size;
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

function handleThemeChange(newTheme: Theme): void {
 const themes: Record<Theme, () => void> = {
   [Theme.Light]: () => console.log("Switching to light theme"),
   [Theme.Dark]: () => console.log("Switching to dark theme"), 
   [Theme.Auto]: () => console.log("Using system theme")
 };
 
 themes[newTheme]?.();
}