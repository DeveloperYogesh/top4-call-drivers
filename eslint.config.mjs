import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // keep Next.js recommended configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // project-specific overrides / rule adjustments
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      // allow `any` (won't block build)
      "@typescript-eslint/no-explicit-any": "off",

      // don't fail build for unused vars in arguments; allow "_" prefix to mark intentionally unused
      // make unused-vars a warning rather than error
      "no-unused-vars": "off", // disable the base rule in favor of the TS rule
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }
      ],

      // allow unescaped entities in JSX (or set to "warn" if you prefer)
      "react/no-unescaped-entities": "off",

      // optional: don't force explicit return types on module boundaries
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];

export default eslintConfig;
