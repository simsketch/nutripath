import nextConfig from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextConfig,
  ...nextCoreWebVitals,
  {
    ignores: [
      "ios/**",
      "android/**",
      ".next/**",
      "node_modules/**",
      "drizzle/**",
    ],
  },
];

export default eslintConfig;
