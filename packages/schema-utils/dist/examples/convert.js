"use strict";
import { convertOpenAISchemaToGemini, stringifyCustom } from "../lib/helper.js";
import { jsonNavigatorOutputSchema } from "../lib/json_schema.js";
console.log("Converting jsonNavigatorOutputSchema to Gemini format...");
const geminiSchema = convertOpenAISchemaToGemini(jsonNavigatorOutputSchema);
console.log(stringifyCustom(geminiSchema));
//# sourceMappingURL=convert.js.map
