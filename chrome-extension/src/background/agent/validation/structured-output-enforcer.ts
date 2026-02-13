import { z } from 'zod';
import { createLogger } from '@src/background/log';

const logger = createLogger('StructuredOutputEnforcer');

/**
 * Result of validation and enforcement
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data?: unknown;
}

/**
 * Configuration options for structured output enforcement
 */
export interface StructuredOutputConfig {
  strictMode?: boolean;
  allowedFields?: string[];
  requiredFields?: string[];
  customValidators?: Record<string, (value: unknown) => boolean>;
  maxStringLength?: number;
  sanitizeStrings?: boolean;
}

/**
 * Configuration for output enforcement
 */
export interface EnforcementConfig {
  strictMode: boolean;
  sanitizeStrings: boolean;
  maxStringLength: number;
  allowedFields: string[];
  requiredFields: string[];
  customValidators: Record<string, (value: unknown) => boolean>;
}

/**
 * Default configuration for output enforcement
 */
export const DEFAULT_ENFORCEMENT_CONFIG: EnforcementConfig = {
  strictMode: false,
  sanitizeStrings: true,
  maxStringLength: 10000,
  allowedFields: [],
  requiredFields: [],
  customValidators: {},
};

/**
 * Enforces structured output validation and sanitization
 */
export class StructuredOutputEnforcer {
  private config: EnforcementConfig;

  constructor(config: Partial<EnforcementConfig> = {}) {
    this.config = { ...DEFAULT_ENFORCEMENT_CONFIG, ...config };
  }

  /**
   * Validates and enforces structured output against a schema
   */
  async enforce<T extends z.ZodSchema>(
    data: unknown,
    schema: T,
    context?: string,
  ): Promise<ValidationResult & { data?: z.infer<T> }> {
    const result: ValidationResult & { data?: z.infer<T> } = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    try {
      // Step 1: Basic type check
      if (typeof data !== 'object' || data === null) {
        result.isValid = false;
        result.errors.push('Data must be an object');
        return result;
      }

      let validatedData = { ...data } as Record<string, unknown>;

      // Step 2: Field-level validation (before Zod to catch extra fields)
      if (this.config.allowedFields.length > 0) {
        const dataFields = Object.keys(validatedData);
        const disallowedFields = dataFields.filter(
          field => !this.config.allowedFields.includes(field)
        );

        if (disallowedFields.length > 0) {
          if (this.config.strictMode) {
            result.isValid = false;
            result.errors.push(`Disallowed fields: ${disallowedFields.join(', ')}`);
          } else {
            result.warnings.push(`Unexpected fields: ${disallowedFields.join(', ')}`);
          }
        }
      }

      // Step 3: Required field validation
      if (this.config.requiredFields.length > 0) {
        const dataFields = Object.keys(validatedData);
        const missingFields = this.config.requiredFields.filter(
          field => !dataFields.includes(field)
        );

        if (missingFields.length > 0) {
          result.isValid = false;
          result.errors.push(`Missing required fields: ${missingFields.join(', ')}`);
        }
      }

      // Step 4: Zod schema validation
      const parsed = await schema.parseAsync(validatedData);
      validatedData = parsed as Record<string, unknown>;

      // Step 5: String sanitization
      if (this.config.sanitizeStrings) {
        const sanitized = this.sanitizeStrings(validatedData, result);
        result.data = sanitized as z.infer<T>;
      } else {
        result.data = validatedData as z.infer<T>;
      }

      // Step 6: Custom validation
      for (const [field, validator] of Object.entries(this.config.customValidators)) {
        const value = (validatedData as Record<string, unknown>)[field];
        if (value !== undefined && !validator(value)) {
          result.isValid = false;
          result.errors.push(`Custom validation failed for field: ${field}`);
        }
      }

      // Step 7: Length validation
      this.validateLengths(validatedData, result);

      // Log validation results
      if (result.errors.length > 0) {
        logger.error(`Structured output validation failed${context ? ` for ${context}` : ''}`, {
          errors: result.errors,
          warnings: result.warnings,
        });
      } else if (result.warnings.length > 0) {
        logger.info(`Structured output validation warnings${context ? ` for ${context}` : ''}`, {
          warnings: result.warnings,
        });
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        result.isValid = false;
        // Add Zod errors to existing errors, don't replace them
        result.errors.push(...error.errors.map(e => `${e.path.join('.')}: ${e.message}`));
        logger.error(`Schema validation failed${context ? ` for ${context}` : ''}`, result.errors);
      } else {
        result.isValid = false;
        result.errors = [`Unexpected validation error: ${error instanceof Error ? error.message : String(error)}`];
        logger.error(`Unexpected validation error${context ? ` for ${context}` : ''}`, error);
      }

      return result;
    }
  }

  /**
   * Sanitizes string values to prevent injection and ensure safety
   */
  private sanitizeStrings<T>(data: T, result: ValidationResult, path = ''): T {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized = { ...data } as Record<string, unknown>;

    for (const [key, value] of Object.entries(sanitized)) {
      if (typeof value === 'string') {
        // Check for potential script injections
        if (/<script|javascript:|data:/i.test(value)) {
          const fullPath = path ? `${path}.${key}` : key;
          result.warnings.push(`Potentially unsafe content in field: ${fullPath}`);
          logger.info(`Sanitized content in field: ${fullPath}`);
          sanitized[key] = value.replace(/<script[^>]*>.*?<\/script>/gi, '[REMOVED]');
        }

        // Truncate if too long
        if (value.length > this.config.maxStringLength) {
          const fullPath = path ? `${path}.${key}` : key;
          result.warnings.push(`String truncated in field: ${fullPath} (${value.length} > ${this.config.maxStringLength})`);
          sanitized[key] = value.substring(0, this.config.maxStringLength) + '...';
        }
      } else if (typeof value === 'object' && value !== null) {
        const fullPath = path ? `${path}.${key}` : key;
        sanitized[key] = this.sanitizeStrings(value, result, fullPath);
      }
    }

    return sanitized as T;
  }

  /**
 * Validates string lengths against configured limits
 * Note: Length validation is now handled in sanitizeStrings to avoid duplication
 */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private validateLengths(_data: unknown, _result: ValidationResult): void {
    // Length validation is handled in sanitizeStrings to avoid duplication
    // This method is kept for backward compatibility but can be removed in future
  }

  /**
   * Creates a new enforcer with additional configuration
   */
  withConfig(config: Partial<EnforcementConfig>): StructuredOutputEnforcer {
    return new StructuredOutputEnforcer({ ...this.config, ...config });
  }

  /**
   * Gets the current configuration
   */
  getConfig(): EnforcementConfig {
    return { ...this.config };
  }
}

/**
 * Default enforcer instance
 */
export const defaultOutputEnforcer = new StructuredOutputEnforcer();

/**
 * Convenience function to validate output with default settings
 */
export async function validateStructuredOutput<T extends z.ZodType>(
  data: unknown,
  schema: T,
  context?: string
): Promise<ValidationResult & { data?: z.infer<T> }> {
  return defaultOutputEnforcer.enforce(data, schema, context);
}
