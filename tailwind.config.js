/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    screens: {
      sm: "22rem",
      md: "40rem",
      lg: "75rem",
    },
    colors: {
      background: {
        base: "var(--background-base)",
        100: "var(--background-100)",
      },
      neutral: {
        100: "var(--neutral-100)",
        300: "var(--neutral-300)",
        500: "var(--neutral-500)",
        900: "var(--neutral-900)",
      },
      contrast: "var(--contrast-color)",
      green: "var(--green)",
      yellow: "var(--yellow)",
      cyan: "var(--cyan)",
      navy: "var(--navy)",
      red: "var(--red)",
      purple: "var(--purple)",
      turquoise: "var(--turquoise)",
      brown: "var(--brown)",
      magenta: "var(--magenta)",
      blue: "var(--blue)",
      "navv-grey": "var(--navv-grey)",
      "army-green": "var(--army-green)",
      pink: "var(--pink)",
      gold: "var(--gold)",
      orange: "var(--orange)",
      white: "var(--white)",
    },
    extend: {},
  },
  plugins: [],
};
