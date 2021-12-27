const colors = require("tailwindcss/colors");

module.exports = {
    mode: "jit",
    purge: [
        "./src/windows/**/*.{js,jsx,ts,tsx}",
        "./src/components/**/*.{js,jsx,ts,tsx}",
        "./src/index.html",
        "./src/**/*.css",
    ],
    darkMode: "class", // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                sky: colors.sky,
                cyan: colors.cyan,
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require("tailwind-scrollbar")],
    variants: {
        scrollbar: ["rounded"],
    },
};
