import * as React from 'react'
import {FocusEvent, ChangeEvent, DragEvent} from 'react'
import {Store} from '../../reducers'
import { Field, GenericFieldArray, FieldArray, Formatter, Normalizer, Parser, Validator } from 'redux-form'

/** Augment props for a native input element with custom ValueType and our additional props */
export type InputProps<E extends keyof JSX.IntrinsicElements = 'input', ValueType = any> =
  JSX.IntrinsicElements[E] & SharedInputProps<ValueType>

/** Augment InputProps with SharedWrappedInputProps */
export type WrappedInputProps<InputProps> = SharedWrappedInputProps & InputProps

/** Augment Field props with SharedWrappedInputProps */
export type FieldProps<ComponentProps, ValueType=any> = RFField.BaseFieldProps<DropHandlers<ComponentProps>, ValueType> & DropHandlers<ComponentProps>

/** Removes all event handler props from an object */
type DropHandlers<ComponentProps> = ObjectOmitAny<ComponentProps, 'onBlur'|'onChange'|'onDragStart'|'onDrop'|'onFocus'>

/** Augment FieldArray props with SharedWrappedInputProps */
export type FieldArrayProps<FieldValue, AdditionalProps> = RFFieldArray.FieldArrayProps<FieldValue, AdditionalProps>

/** Create a type for the props passed into the renderComponent function of each XxxField */
export type FieldRenderProps<ForwardedProps, ValueType=any> = RFField.WrappedFieldProps<ValueType> & ForwardedProps

/** Create a type for the props passed into the renderComponent function of each XxxFieldList */
export type FieldArrayRenderProps<ForwardedProps, ValueType=any> = RFFieldArray.WrappedFieldArrayProps<ValueType> & ForwardedProps

/**
 * A function that renders a field in a FieldArray
 *
 * Derived from the FieldIterate in RFFieldArray but with somewhat refined types
 */
export type FieldComponent<FieldValue> = (name: string, index: number, fields: RFFieldArray.FieldsProps<FieldValue>) => React.ReactElement<any>

/**
 * We need to use this function to obtain a correctly typed version of Field
 */
export function makeConcreteField<WrappedInputProps, FieldValue=any>(): new() => RFField.GenericField<WrappedInputProps, FieldValue>{
  return Field as any
}

/**
 * We need to use this function to obtain a correctly typed version of FieldArray
 */
export function makeConcreteFieldArray<FieldValue, ComponentProps>(): new() => GenericFieldArray<FieldValue, ComponentProps>{
  return FieldArray
}

/**
 * Custom props that all our inputs (non-wrapped) have in common
 *
 * These overlap with the native input props because they are also used for non-native Inputs
 */
interface SharedInputProps<T> {
  className?:   string
  disabled?:    boolean
  readOnly?:    boolean
  value?: T
}

/** Props that all our Wrapped Inputs have in common*/
interface SharedWrappedInputProps {
  inputClassName?: string
  className?:  string
  disabled?:   boolean
  error?:      React.ReactNode
  floatLabel?: boolean
  fullWidth?:  boolean
  label?:      string
  medium?:     boolean
  large?:      boolean
  name?:       string
  required?:   boolean
  tooltip?:    React.ReactChild
}

/**
 * Definitions from DT Field
 */
namespace RFField {
  /**
   * These are the props on <Field>
   *
   * Copied from DT and modified such that the Handler signatures are correct
   */
  export interface BaseFieldProps<ComponentProps, ValueType> {
    name: string;
    component?: React.ComponentType<ComponentProps> | "input" | "select" | "textarea",
    format?: Formatter
    normalize?: Normalizer
    props?: ComponentProps;
    parse?: Parser;
    validate?: Validator | Validator[];
    warn?: Validator | Validator[];
    withRef?: boolean;

    //This was Partial<CommonFieldProps>
    onBlur?: FieldEventAndValueHandler<FocusEvent<any>, ValueType>;
    onChange?: FieldEventAndValueHandler<ChangeEvent<any>, ValueType>;
    onDragStart?: FieldEventAndValueHandler<DragEvent<any>, ValueType>;
    onDrop?: FieldEventAndValueHandler<DragEvent<any>, ValueType>;
    onFocus?: FieldEventAndValueHandler<FocusEvent<any>, ValueType>;
  }

  /**
   * Interface for a <Field> component
   *
   * Copied from DT and adjusted for the correct handler signatures
   */
  export interface GenericField<ComponentProps, ValueType> extends React.Component<BaseFieldProps<ComponentProps, ValueType> & DropHandlers<ComponentProps>> {
    dirty: boolean;
    name: string;
    pristine: boolean;
    value: any;
    getRenderedComponent(): React.Component<WrappedFieldProps<ValueType> & ComponentProps>;
  }

  /** The props that ReduxForm injects into the components it's rendering */
  export interface WrappedFieldProps<ValueType=any> {
    input: WrappedFieldInputProps<ValueType>
    meta: WrappedFieldMetaProps
  }

  /**
   * The shape of the meta prop injected into the component for a <Field>
   *
   * Copied from DT, refined dispatch prop
   */
  interface WrappedFieldMetaProps {
    active?: boolean;
    autofilled: boolean;
    asyncValidating: boolean;
    dirty: boolean;
    dispatch: Store['dispatch']
    error?: any;
    form: string;
    initial: any;
    invalid: boolean;
    pristine: boolean;
    submitting: boolean;
    submitFailed: boolean;
    touched: boolean;
    valid: boolean;
    visited: boolean;
    warning?: any;
  }

  /**
   * The shape of the input prop injected into the component for a <Field>
   *
   *  Copied from DT, replaced hardcoded "any" with Type param
   */
  interface WrappedFieldInputProps<ValueType = any> {
    // This is from the DT WrappedFieldInputProps:
    checked?: boolean;
    value: ValueType;

    // This is from the DT CommonFieldProps (but with our own Handler signature):
    name: string;
    onBlur: ComponentEventOrValueHandler<FocusEvent<any>, ValueType>;
    onChange: ComponentEventOrValueHandler<ChangeEvent<any>, ValueType>;
    onDragStart: ComponentEventOrValueHandler<DragEvent<any>, ValueType>;
    onDrop: ComponentEventOrValueHandler<DragEvent<any>, ValueType>;
    onFocus: ComponentEventOrValueHandler<FocusEvent<any>, ValueType>;
  }

  /**
   * These are the type of eventhandler invocations that Redux Form supports
   *
   * The DT definitions conflate as a single signature, what we split up into
   * ComponentEventOrValueHandler and FieldEventAndValueHandler
   */
  interface ComponentEventOrValueHandler<Event, ValueType=any> {
    (event: Event): void;
    (value: ValueType): void;
  }

  /**
   * This is the type of handlers <Field> expects in its onXxx props
   */
  interface FieldEventAndValueHandler<Event, T> {
    (event: Event, newValue: T, oldValue: T):void
  }
}

/**
 * Definitions from DT FieldArray
 */
namespace RFFieldArray {
  /** The props accepted by a ReduxForm <Field> */
  export type FieldArrayProps<FieldValue, AdditionProps> = GenericFieldArray<FieldValue, AdditionProps>['props']

  /** Copied from DT */
  type FieldIterate<FieldValue, R = void> = (name: string, index: number, fields: FieldsProps<FieldValue>) => R;

  /** Copied from DT */
  export interface FieldsProps<FieldValue> {
    forEach(callback: FieldIterate<FieldValue>): void;
    get(index: number): FieldValue;
    getAll(): FieldValue[];
    insert(index: number, value: FieldValue): void;
    length: number;
    map<R>(callback: FieldIterate<FieldValue, R>): R[];
    pop(): FieldValue;
    push(value: FieldValue): void;
    remove(index: number): void;
    shift(): FieldValue;
    swap(indexA: number, indexB: number): void;
    unshift(value: FieldValue): void;
  }

  /** Copied from DT */
  interface FieldArrayMetaProps {
      dirty: boolean;
      error?: string;
      form: string;
      invalid: boolean;
      pristine: boolean;
      submitting: boolean;
      valid: boolean;
      warning?: string;
  }

  /** Copied from DT */
  export interface WrappedFieldArrayProps<FieldValue> {
      fields: FieldsProps<FieldValue>;
      meta: FieldArrayMetaProps;
  }
}