import * as joiTypes from 'joi'

declare module 'joi' {
  export interface Joi {
    validate<T>(value: T, schema?: joiTypes.Schema | Object, options?: joiTypes.ValidationOptions): joiTypes.ValidationResult<T>
    validate<T, R>(value: T, callback: (err: joiTypes.ValidationError, value: T) => R): R
    validate<T, R>(value: T, schema: joiTypes.Schema | Object, callback: (err: joiTypes.ValidationError, value: T) => R): R
    validate<T, R>(value: T, schema: joiTypes.Schema | Object, options: joiTypes.ValidationOptions, callback: (err: joiTypes.ValidationError, value: T) => R): R
    compile(schema: Object): joiTypes.Schema
    assert(value: {}, schema: Schema, message?: string | Error): void
    attempt<T>(value: T, schema: Schema, message?: string | Error): T
    ref(key: string, options?: joiTypes.ReferenceOptions): joiTypes.Reference
    isRef(ref: {}): boolean
    reach(schema: Schema, path: string): Schema
    extend(extention: Extension): {}
    allow(value: {}, ...values: {}[]): Schema
    allow(values: {}[]): Schema
    valid(value: {}, ...values: {}[]): Schema
    valid(values: {}[]): Schema
    only(value: {}, ...values: {}[]): Schema
    only(values: {}[]): Schema
    equal(value: {}, ...values: {}[]): Schema
    equal(values: {}[]): Schema
    invalid(value: {}, ...values: {}[]): Schema
    invalid(values: {}[]): Schema
    disallow(value: {}, ...values: {}[]): Schema
    disallow(values: {}[]): Schema
    not(value: {}, ...values: {}[]): Schema
    not(values: {}[]): Schema
    required(): Schema
    optional(): Schema
    forbidden(): Schema
    strip(): Schema
    description(desc: string): Schema
    notes(notes: string | string[]): Schema
    tags(notes: string | string[]): Schema
    meta(meta: Object): Schema
    example(value: {}): Schema
    unit(name: string): Schema
    options(options: ValidationOptions): Schema
    strict(isStrict?: boolean): Schema
    concat<T>(schema: T): T
    when<U>(ref: string | Reference, options: WhenOptions): AlternativesSchema
    label(name: string): Schema
    raw(isRaw?: boolean): Schema
    empty(schema?: {}): Schema
    any(): joiTypes.Schema
    array(): joiTypes.ArraySchema
    bool(): joiTypes.BooleanSchema
    boolean(): joiTypes.BooleanSchema
    binary(): joiTypes.BinarySchema
    date(): joiTypes.DateSchema
    func(): joiTypes.FunctionSchema
    number(): joiTypes.NumberSchema
    object(): joiTypes.ObjectSchema
    string(): joiTypes.StringSchema
    alternatives(): joiTypes.AlternativesSchema
    lazy(cb: () => Schema): Schema
  }
} 
