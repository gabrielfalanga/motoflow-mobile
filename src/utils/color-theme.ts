import { vars } from "nativewind"

export const themes = {
  light: vars({
    "--color-primary": "#05AF31",
    "--color-secondary": "rgba(0, 0, 0, 0.1)",
    "--color-background": "#f9f9f9",
    "--color-text": "#000000",
    "--color-foreground": "#333333",
    "--color-card": "#ffffff",
    "--color-muted-foreground": "#666666",
  }),
  dark: vars({
    "--color-primary": "#05AF31",
    "--color-secondary": "rgba(255, 255, 255, 0.2)",
    "--color-background": "#333",
    "--color-text": "#ffffff",
    "--color-foreground": "#ffffff",
    "--color-card": "#222222",
    "--color-muted-foreground": "#cccccc",
  }),
}
