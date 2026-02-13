import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { StructuredOutputEnforcer, validateStructuredOutput } from '../structured-output-enforcer';

describe('StructuredOutputEnforcer', () => {
  const testSchema = z.object({
    name: z.string(),
    age: z.number(),
    email: z.string().email(),
    description: z.string().optional(),
  });

  it('should validate correct data', async () => {
    const enforcer = new StructuredOutputEnforcer();
    const data = {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      description: 'A test user',
    };

    const result = await enforcer.enforce(data, testSchema, 'test');

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.data).toEqual(data);
  });

  it('should reject invalid data', async () => {
    const enforcer = new StructuredOutputEnforcer();
    const data = {
      name: 'John Doe',
      age: 'not-a-number',
      email: 'invalid-email',
    };

    const result = await enforcer.enforce(data, testSchema, 'test');

    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.data).toBeUndefined();
  });

  it('should sanitize strings with script tags', async () => {
    const enforcer = new StructuredOutputEnforcer();
    const data = {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      description: '<script>alert("xss")</script>Safe content',
    };

    const result = await enforcer.enforce(data, testSchema, 'test');

    expect(result.isValid).toBe(true);
    expect(result.warnings).toContain('Potentially unsafe content in field: description');
    expect(result.data?.description).toBe('[REMOVED]Safe content');
  });

  it('should truncate long strings', async () => {
    const enforcer = new StructuredOutputEnforcer({ maxStringLength: 20 });
    const longString = 'a'.repeat(100);
    const data = {
      name: longString,
      age: 30,
      email: 'john@example.com',
    };

    const result = await enforcer.enforce(data, testSchema, 'test');

    expect(result.isValid).toBe(true);
    expect(result.warnings).toContain(`String truncated in field: name (${longString.length} > 20)`);
    expect(result.data?.name).toHaveLength(23); // 20 chars + '...'
  });

  it('should enforce allowed fields in strict mode', async () => {
    const enforcer = new StructuredOutputEnforcer({
      strictMode: true,
      allowedFields: ['name', 'age', 'email'],
    });
    const data = {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      description: 'Should not be allowed',
      extraField: 'Also not allowed',
    };

    const result = await enforcer.enforce(data, testSchema, 'test');

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Disallowed fields: description, extraField');
  });

  it('should warn about disallowed fields in non-strict mode', async () => {
    const enforcer = new StructuredOutputEnforcer({
      strictMode: false,
      allowedFields: ['name', 'age', 'email'],
    });
    const data = {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      description: 'Unexpected but allowed',
    };

    const result = await enforcer.enforce(data, testSchema, 'test');

    expect(result.isValid).toBe(true);
    expect(result.warnings).toContain('Unexpected fields: description');
  });

  it('should validate required fields', async () => {
    const enforcer = new StructuredOutputEnforcer({
      requiredFields: ['name', 'email'],
    });
    const data = {
      age: 30,
    };

    const result = await enforcer.enforce(data, testSchema, 'test');

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Missing required fields: name, email');
  });

  it('should apply custom validators', async () => {
    const enforcer = new StructuredOutputEnforcer({
      customValidators: {
        age: (value: unknown) => typeof value === 'number' && value >= 18,
      },
    });
    const data = {
      name: 'John Doe',
      age: 15,
      email: 'john@example.com',
    };

    const result = await enforcer.enforce(data, testSchema, 'test');

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Custom validation failed for field: age');
  });

  it('should work with convenience function', async () => {
    const data = {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
    };

    const result = await validateStructuredOutput(data, testSchema, 'test');

    expect(result.isValid).toBe(true);
    expect(result.data).toEqual(data);
  });

  it('should handle nested objects', async () => {
    const nestedSchema = z.object({
      user: z.object({
        name: z.string(),
        profile: z.object({
          bio: z.string(),
        }),
      }),
    });

    const enforcer = new StructuredOutputEnforcer({ maxStringLength: 50 });
    const data = {
      user: {
        name: 'John',
        profile: {
          bio: 'a'.repeat(100),
        },
      },
    };

    const result = await enforcer.enforce(data, nestedSchema, 'test');

    expect(result.isValid).toBe(true);
    expect(result.warnings).toContain(`String truncated in field: user.profile.bio (${100} > 50)`);
    expect(result.data?.user.profile.bio).toHaveLength(53);
  });
});
