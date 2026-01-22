"use strict";
import deepmerge from "deepmerge";
export function withUI(tailwindConfig) {
  return deepmerge(tailwindConfig, {
    content: ["./node_modules/@extension/ui/lib/**/*.{tsx,ts,js,jsx}"]
  });
}
//# sourceMappingURL=withUI.js.map
