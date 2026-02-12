"use strict";
const __defProp = Object.defineProperty;
const __defProps = Object.defineProperties;
const __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
const __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const __objRest = (source, exclude) => {
  const target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import { jsx } from "react/jsx-runtime";
import { cn } from "../utils";
export function Button(_a) {
  const _b = _a, { theme, variant = "primary", className, disabled, children } = _b, props = __objRest(_b, ["theme", "variant", "className", "disabled", "children"]);
  return /* @__PURE__ */ jsx(
    "button",
    __spreadProps(__spreadValues({
      className: cn(
        "py-1 px-4 rounded shadow transition-all",
        {
          // Primary variant
          "bg-blue-500 hover:bg-blue-600 text-white hover:scale-105": variant === "primary" && !disabled && theme !== "dark",
          "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105": variant === "primary" && !disabled && theme === "dark",
          "bg-gray-400 text-gray-600 cursor-not-allowed": variant === "primary" && disabled,
          // Secondary variant
          "bg-gray-300 hover:bg-gray-400 text-gray-800 hover:scale-105": variant === "secondary" && !disabled,
          "bg-gray-100 text-gray-400 cursor-not-allowed": variant === "secondary" && disabled,
          // Danger variant
          // Note: bg-red-400 causes the button to appear black (RGB 0,0,0) for unknown reasons
          // Using bg-red-500 with opacity to achieve a softer look
          "bg-red-600 bg-opacity-80 hover:bg-red-700 hover:bg-opacity-90 text-white hover:scale-105": variant === "danger" && !disabled && theme !== "dark",
          "bg-red-500 bg-opacity-70 hover:bg-red-700 hover:bg-opacity-90 text-white hover:scale-105": variant === "danger" && !disabled && theme === "dark",
          "bg-red-300 bg-opacity-80 text-red-100 cursor-not-allowed": variant === "danger" && disabled
        },
        className
      ),
      disabled
    }, props), {
      children
    })
  );
}
//# sourceMappingURL=Button.js.map
