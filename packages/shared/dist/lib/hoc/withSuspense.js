"use strict";
const __defProp = Object.defineProperty;
const __getOwnPropSymbols = Object.getOwnPropertySymbols;
const __hasOwnProp = Object.prototype.hasOwnProperty;
const __propIsEnum = Object.prototype.propertyIsEnumerable;
const __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
const __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
import { jsx } from "react/jsx-runtime";
import { Suspense } from "react";
export function withSuspense(Component, SuspenseComponent) {
  return function WithSuspense(props) {
    return /* @__PURE__ */ jsx(Suspense, { fallback: SuspenseComponent, children: /* @__PURE__ */ jsx(Component, __spreadValues({}, props)) });
  };
}
//# sourceMappingURL=withSuspense.js.map
