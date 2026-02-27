"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const BlocksRenderer = require("./BlocksRenderer.cjs");
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const React__namespace = /* @__PURE__ */ _interopNamespace(React);
const replaceLineBreaks = (text) => {
  const split = text.split(/\r?\n|\r/g);
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: split.map((part, idx) => /* @__PURE__ */ jsxRuntime.jsxs(React__namespace.Fragment, { children: [
    idx > 0 && /* @__PURE__ */ jsxRuntime.jsx("br", {}),
    part
  ] }, idx)) });
};
const Text = ({ text, ...modifiers }) => {
  const { modifiers: modifierComponents, missingModifierTypes } = BlocksRenderer.useComponentsContext();
  const modifierNames = Object.keys(modifiers);
  return modifierNames.reduce(
    (children, modifierName) => {
      if (!modifiers[modifierName]) {
        return children;
      }
      const ModifierComponent = modifierComponents[modifierName];
      if (!ModifierComponent) {
        if (!missingModifierTypes.includes(modifierName)) {
          console.warn(
            `[@strapi/block-react-renderer] No component found for modifier "${modifierName}"`
          );
          missingModifierTypes.push(modifierName);
        }
        return children;
      }
      return /* @__PURE__ */ jsxRuntime.jsx(ModifierComponent, { children });
    },
    // By default, return the text without any wrapper to avoid useless nesting
    replaceLineBreaks(text)
  );
};
exports.Text = Text;
//# sourceMappingURL=Text.cjs.map
