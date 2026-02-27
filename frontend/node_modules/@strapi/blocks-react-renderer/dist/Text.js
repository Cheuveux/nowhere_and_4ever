import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useComponentsContext } from "./BlocksRenderer.js";
const replaceLineBreaks = (text) => {
  const split = text.split(/\r?\n|\r/g);
  return /* @__PURE__ */ jsx(Fragment, { children: split.map((part, idx) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
    idx > 0 && /* @__PURE__ */ jsx("br", {}),
    part
  ] }, idx)) });
};
const Text = ({ text, ...modifiers }) => {
  const { modifiers: modifierComponents, missingModifierTypes } = useComponentsContext();
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
      return /* @__PURE__ */ jsx(ModifierComponent, { children });
    },
    // By default, return the text without any wrapper to avoid useless nesting
    replaceLineBreaks(text)
  );
};
export {
  Text
};
//# sourceMappingURL=Text.js.map
