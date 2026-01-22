"use strict";
import { dereferenceJsonSchema, stringifyCustom } from "../lib/helper.js";
import { jsonNavigatorOutputSchema } from "../lib/json_schema.js";
console.log("Flattening jsonNavigatorOutputSchema...");
const flattenedSchema = dereferenceJsonSchema(jsonNavigatorOutputSchema);
console.log("Flattened Schema (Custom Format):");
console.log(stringifyCustom(flattenedSchema));
const originalSize = JSON.stringify(jsonNavigatorOutputSchema).length;
const flattenedSize = JSON.stringify(flattenedSchema).length;
console.log("\nSize comparison:");
console.log(`Original schema size: ${originalSize} bytes`);
console.log(`Flattened schema size: ${flattenedSize} bytes`);
console.log(
  `Difference: ${flattenedSize - originalSize} bytes (${(flattenedSize / originalSize * 100).toFixed(2)}% of original)`
);
//# sourceMappingURL=flatten.js.map
