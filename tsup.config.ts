import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false, // This will emit single bundle per format(CJS/ESM)
  sourcemap: true, //For debugging: Because of sourcemap errors can be traced back to original typescript files
  clean: true, //Clears the dist before every build
});
