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
  async enforce<T extends z.ZodType>(
    data: unknown,
    schema: T,
    context?: string
  ): Promise<ValidationResult & { data?: z.infer<T> }> {
    const result: ValidationResult & { data?: z.infer<T> } = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    try {
      // Step 1: Basic schema validation
      let validatedData = schema.parse(data);
      result.data = validatedData;

      // Step 2: Field-level validation
      if (this.config.allowedFields.length > 0) {
        const dataFields = Object.keys(validatedData as Record<string, unknown>);
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
        const dataFields = Object.keys(validatedData as Record<string, unknown>);
        const missingFields = this.config.requiredFields.filter(
          field => !dataFields.includes(field)
        );

        if (missingFields.length > 0) {
          result.isValid = false;
          result.errors.push(`Missing required fields: ${missingFields.join(', ')}`);
        }
      }

      // Step 4: String sanitization
      if (this.config.sanitizeStrings) {
        validatedData = this.sanitizeStrings(validatedData, result);
        result.data = validatedData;
      }

      // Step 5: Custom validation
      for (const [field, validator] of Object.entries(this.config.customValidators)) {
        const value = (validatedData as Record<string, unknown>)[field];
        if (value !== undefined && !validator(value)) {
          result.isValid = false;
          result.errors.push(`Custom validation failed for field: ${field}`);
        }
      }

      // Step 6: Length validation
      this.validateLengths(validatedData, result);

      if (result.errors.length > 0) {
        result.isValid = false;
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
        result.errors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
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
  private sanitizeStrings<T>(data: T, result: ValidationResult): T {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized = { ...data } as Record<string, unknown>;

    for (const [key, value] of Object.entries(sanitized)) {
      if (typeof value === 'string') {
        // Check for potential script injections
        if (/<script|javascript:|data:/i.test(value)) {
          result.warnings.push(`Potentially unsafe content in field: ${key}`);
          logger.info(`Sanitized content in field: ${key}`);
          sanitized[key] = value.replace(/<script[^>]*>.*?<\/script>/gi, '[REMOVED]');
        }

        // Truncate if too long
        if (value.length > this.config.maxStringLength) {
          result.warnings.push(`String truncated in field: ${key} (${value.length} > ${this.config.maxStringLength})`);
          sanitized[key] = value.substring(0, this.config.maxStringLength) + '...';
        }
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeStrings(value, result);
      }
    }

    return sanitized as T;
  }

  /**
   * Validates string lengths against configured limits
   */
  private validateLengths<T>(data: T, result: ValidationResult): void {
    if (typeof data !== 'object' || data === null) {
      return;
    }

    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (typeof value === 'string' && value.length > this.config.maxStringLength) {
        if (this.config.strictMode) {
          result.isValid = false;
          result.errors.push(`String too long in field ${key}: ${value.length} > ${this.config.maxStringLength}`);
        } else {
          result.warnings.push(`String exceeds recommended length in field ${key}: ${value.length}`);
        }
      } else if (typeof value === 'object' && value !== null) {
        this.validateLengths(value, result);
      }
    }
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
