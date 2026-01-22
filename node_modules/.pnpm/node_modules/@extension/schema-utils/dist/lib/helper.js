"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
export function dereferenceJsonSchema(schema) {
  const clonedSchema = JSON.parse(JSON.stringify(schema));
  const definitions = clonedSchema.$defs || {};
  const result = processSchemaNode(clonedSchema, definitions);
  const resultWithoutDefs = {};
  for (const [key, value] of Object.entries(result)) {
    if (key !== "$defs") {
      resultWithoutDefs[key] = value;
    }
  }
  return resultWithoutDefs;
}
function processSchemaNode(node, definitions) {
  if (typeof node !== "object" || node === null) {
    return node;
  }
  if (node.$ref) {
    const refPath = node.$ref.replace("#/$defs/", "");
    const definition = definitions[refPath];
    if (definition) {
      const processedDefinition = processSchemaNode(definition, definitions);
      const result2 = {};
      for (const [key, value] of Object.entries(node)) {
        if (key !== "$ref") {
          result2[key] = value;
        }
      }
      for (const [key, value] of Object.entries(processedDefinition)) {
        if (result2[key] === void 0) {
          result2[key] = value;
        }
      }
      return result2;
    }
  }
  if (node.anyOf) {
    const processedAnyOf = node.anyOf.map((item) => processSchemaNode(item, definitions));
    const nonNullTypes = processedAnyOf.filter((item) => item.type !== "null");
    const hasNullType = processedAnyOf.some((item) => item.type === "null");
    if (nonNullTypes.length === 1 && hasNullType) {
      const result2 = {};
      for (const [key, value] of Object.entries(node)) {
        if (key !== "anyOf") {
          result2[key] = value;
        }
      }
      for (const [key, value] of Object.entries(nonNullTypes[0])) {
        if (result2[key] === void 0) {
          result2[key] = value;
        }
      }
      result2.nullable = true;
      return result2;
    }
    return __spreadProps(__spreadValues({}, node), {
      anyOf: processedAnyOf
    });
  }
  const result = {};
  for (const [key, value] of Object.entries(node)) {
    if (key !== "$ref") {
      if (key === "properties" && typeof value === "object" && value !== null) {
        result.properties = {};
        for (const [propKey, propValue] of Object.entries(value)) {
          result.properties[propKey] = processSchemaNode(propValue, definitions);
        }
      } else if (key === "items" && typeof value === "object" && value !== null) {
        result.items = processSchemaNode(value, definitions);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}
export function convertOpenAISchemaToGemini(openaiSchema, ensureOrder = false) {
  const flattenedSchema = dereferenceJsonSchema(openaiSchema);
  const geminiSchema = {
    type: flattenedSchema.type,
    properties: {},
    required: flattenedSchema.required || []
  };
  if (flattenedSchema.properties) {
    geminiSchema.properties = processPropertiesForGemini(flattenedSchema.properties, ensureOrder);
    if (ensureOrder && geminiSchema.properties) {
      geminiSchema.propertyOrdering = Object.keys(flattenedSchema.properties);
    }
  }
  if (flattenedSchema.description) {
    geminiSchema.description = flattenedSchema.description;
  }
  if (flattenedSchema.format) {
    geminiSchema.format = flattenedSchema.format;
  }
  if (flattenedSchema.enum) {
    geminiSchema.enum = flattenedSchema.enum;
  }
  if (flattenedSchema.nullable) {
    geminiSchema.nullable = flattenedSchema.nullable;
  }
  if (flattenedSchema.type === "array" && flattenedSchema.items) {
    geminiSchema.items = processPropertyForGemini(flattenedSchema.items);
    if (flattenedSchema.minItems !== void 0) {
      geminiSchema.minItems = flattenedSchema.minItems;
    }
    if (flattenedSchema.maxItems !== void 0) {
      geminiSchema.maxItems = flattenedSchema.maxItems;
    }
  }
  return geminiSchema;
}
function processPropertiesForGemini(properties, addPropertyOrdering = false) {
  const result = {};
  for (const [key, value] of Object.entries(properties)) {
    if (typeof value !== "object" || value === null) continue;
    result[key] = processPropertyForGemini(value, addPropertyOrdering);
  }
  return result;
}
function processPropertyForGemini(property, addPropertyOrdering = false) {
  const result = {
    type: property.type
  };
  if (property.description) {
    result.description = property.description;
  }
  if (property.format) {
    result.format = property.format;
  }
  if (property.enum) {
    result.enum = property.enum;
  }
  if (property.nullable) {
    result.nullable = property.nullable;
  }
  if (property.type === "object" && property.properties) {
    result.properties = processPropertiesForGemini(property.properties, addPropertyOrdering);
    if (property.required) {
      result.required = property.required;
    }
    if (addPropertyOrdering && property.properties) {
      result.propertyOrdering = Object.keys(property.properties);
    } else if (property.propertyOrdering) {
      result.propertyOrdering = property.propertyOrdering;
    }
  }
  if (property.type === "array" && property.items) {
    result.items = processPropertyForGemini(property.items, addPropertyOrdering);
    if (property.minItems !== void 0) {
      result.minItems = property.minItems;
    }
    if (property.maxItems !== void 0) {
      result.maxItems = property.maxItems;
    }
  }
  return result;
}
export function stringifyCustom(value, indent = "", baseIndent = "  ") {
  const currentIndent = indent + baseIndent;
  if (value === null) {
    return "null";
  }
  switch (typeof value) {
    case "string":
      return `'${value.replace(/'/g, "\\\\'")}'`;
    case "number":
    case "boolean":
      return String(value);
    case "object": {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return "[]";
        }
        const items = value.map((item) => `${currentIndent}${stringifyCustom(item, currentIndent, baseIndent)}`);
        return `[
${items.join(",\n")}
${indent}]`;
      }
      const keys = Object.keys(value);
      if (keys.length === 0) {
        return "{}";
      }
      const properties = keys.map((key) => {
        const formattedKey = key;
        const formattedValue = stringifyCustom(value[key], currentIndent, baseIndent);
        return `${currentIndent}${formattedKey}: ${formattedValue}`;
      });
      return `{
${properties.join(",\n")}
${indent}}`;
    }
    default:
      return "undefined";
  }
}
//# sourceMappingURL=helper.js.map
