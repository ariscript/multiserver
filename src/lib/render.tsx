import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CSSBaseline from "@mui/material/CssBaseline";
import { HelmetProvider } from "react-helmet-async";

interface ThemifyProps {
    children: React.ReactChild;
}

const Themify = ({ children }: ThemifyProps) => {
    const [theme, setTheme] = useState<"dark" | "light">("light");

    useEffect(() => {
        if (document.body.classList.contains("dark")) setTheme("dark");
        else setTheme("light");

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((m) => {
                if (m.attributeName === "class") {
                    if (document.body.classList.contains("dark"))
                        setTheme("dark");
                    else setTheme("light");
                }
            });
        });

        observer.observe(document.body, { attributes: true });

        return () => observer.disconnect();
    }, []);

    const muiTheme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: theme,
                },
            }),
        [theme]
    );

    return (
        <ThemeProvider theme={muiTheme}>
            <CSSBaseline />
            {children}
        </ThemeProvider>
    );
};

export function render(Component: () => JSX.Element): void {
    const container = document.getElementById("root");
    const root = createRoot(container!);
    root.render(
        <React.StrictMode>
            <HelmetProvider>
                <Themify>
                    <Component />
                </Themify>
            </HelmetProvider>
        </React.StrictMode>
    );
}
