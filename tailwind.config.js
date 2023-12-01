/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cera", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        theme: {
          black: "#1E1F22",
          "dark-gray": "#313338",
          gray: "#36373C",
          "medium-gray": "#44484F",
          "light-gray": "#949BA4",
          white: "#F2F3F5",
          accent: "#df00fe",
          "input-bg": "#F7F7F7",
        },
      },
      fontSize: {
        "2xs": "0.625rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        "@font-face": {
          fontFamily: "Cera",
          fontWeight: "100",
          src: "url(/fonts/FONTSPRINGDEMO-CeraRoundProThinRegular.woff)",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "Cera",
          fontWeight: "200",
          src: "url(/fonts/FONTSPRINGDEMO-CeraRoundProLightRegular.woff)",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "Cera",
          fontWeight: "300",
          src: "url(/fonts/FONTSPRINGDEMO-CeraRoundProRegular.woff)",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "Cera",
          fontWeight: "400",
          src: "url(/fonts/FONTSPRINGDEMO-CeraRoundProMediumRegular.woff)",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "Cera",
          fontWeight: "500",
          src: "url(/fonts/FONTSPRINGDEMO-CeraRoundProBold.woff)",
        },
      });
      addBase({
        "@font-face": {
          fontFamily: "Cera",
          fontWeight: "600",
          src: "url(/fonts/FONTSPRINGDEMO-CeraRoundProBlackRegular.woff)",
        },
      });
    }),
  ],
};
