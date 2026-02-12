// lib/i18n.ts
function t(key, substitutions) {
  return chrome.i18n.getMessage(key, substitutions);
}
t.devLocale = "";

// index.ts
var t2 = t;
export {
  t2 as t
};
//# sourceMappingURL=index.js.map
