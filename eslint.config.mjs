import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: [
      "src/components/DatePickerField.tsx",
      "src/components/SelectComponent.tsx",
      "src/components/TextFieldMask.tsx",
      "src/layout/components/ContatosForm/**/*.tsx",
      "src/layout/components/EnderecoForm/**/*.{ts,tsx}",
    ],
    rules: {
      // Estes componentes genéricos adaptam caminhos dinâmicos do React Hook Form.
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
