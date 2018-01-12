import * as React   from 'react'
import {isEqual}    from 'lodash'
import * as c       from 'classnames'
import Icon         from '../Icon'
import InputWrapper from '../forms/InputWrapper'
import * as form    from '../forms/form.less'
import {InputProps, WrappedInputProps, FieldProps, FieldRenderProps, makeConcreteField} from './FieldTypes'

type SelectFieldProps<T> = FieldProps<WrappedSelectInputProps<T>>

class SelectField<T> extends React.Component<SelectFieldProps<T>> {
  /**
   * Use this to cast SelectField to a refined version inside a render function.
   *
   * Necessary until Typescript properly supports Generics in classes/JSX
   */
  static of<T>(): new() => SelectField<T> {
    return SelectField as any
  }

  render() {
    const Field = makeConcreteField<WrappedSelectInputProps<T>>()
    return (
      <Field
        className={this.props.className}
        component={this.renderComponent}
        disabled={this.props.disabled}
        inputClassName={this.props.inputClassName}
        label={this.props.label}
        large={this.props.large}
        name={this.props.name}
        options={this.props.options}
        onChange={this.props.onChange}
        required={this.props.required}
        tooltip={this.props.tooltip}
      />
    )
  }

  renderComponent(props: FieldRenderProps<WrappedSelectInputProps<T>>) {
    const WrappedSelectInputT = WrappedSelectInput.of<T>()

    return (
      <WrappedSelectInputT
        {...props.input}
        className={props.className}
        disabled={props.disabled}
        error={props.meta.touched && props.meta.error}
        inputClassName={props.inputClassName}
        label={props.label}
        large={props.large}
        options={props.options}
        required={props.required}
        tooltip={props.tooltip}
      />
    )
  }
}


type WrappedSelectInputProps<T> = WrappedInputProps<SelectInputProps<T>>

export class WrappedSelectInput<T> extends React.Component<WrappedSelectInputProps<T>> {
  static of<T>(): new() => WrappedSelectInput<T> {
    return WrappedSelectInput as any
  }

  render() {
    const SelectInputT = SelectInput.of<T>()
    return (
      <InputWrapper
        className={c(this.props.className, {[form.large]: this.props.large})}
        error={this.props.error}
        label={this.props.label}
        required={this.props.required}
        tooltip={this.props.tooltip}
      >
        <SelectInputT
          className={c({[form.inputInvalid]: !!this.props.error}, this.props.inputClassName)}
          disabled={this.props.disabled}
          name={this.props.name}
          onBlur={this.props.onBlur}
          onChange={this.props.onChange}
          options={this.props.options}
          value={this.props.value}
        />
      </InputWrapper>
    )
  }
}

export interface Option<T> {
  /** The label for the select */
  0: string
  /** The value for this label */
  1: T,
  /** Disabled flag for this label */
  2?: boolean
}

interface SelectInputProps<T> {
  onChange?(value: T): void
  options: Option<T>[]
  readOnly?: boolean
  inline?: boolean
  disabled?: boolean
  className?: string
  onBlur?(value: T):void
  value?: T
  name?: string
}

export class SelectInput<T> extends React.Component<SelectInputProps<T>> {
  static of<T>(): new() => SelectInput<T> {
    return SelectInput as any
  }

  render() {
    const selectedIndex = this.selectedIndex()
    const options = this.getOptions()
    return (
      <div className={c(form.selectWrapper, {[form.inlineSelectWrapper]: this.props.inline})}>
        <select
          name={this.props.name}
          value={selectedIndex}
          className={c(form.select, {[form.inlineSelect]: this.props.inline}, this.props.className)}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          disabled={this.props.readOnly || this.props.disabled || options.length <= 1}
        >
          {options.map(
            (option, i) => <option key={i} value={i} hidden={option[2]}>{option[0]}</option>
          )}
        </select>
        <Icon name="chevron-down" className={form.selectArrow}/>
      </div>
    )
  }

  handleChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    const s = e.currentTarget.value
    const i = parseInt(s, 10)
    const option = this.getOptions()[i]
    const value: T = option[1]
    if (this.props.onChange) this.props.onChange(value)
  }

  handleBlur = (e:React.FocusEvent<HTMLSelectElement>) => {
    const s = e.currentTarget.value
    const i = parseInt(s, 10)
    const option = this.getOptions()[i]
    const value: T = option[1]
    if (this.props.onBlur) this.props.onBlur(value)
  }

  /** The options, padded with an "Unknown value" option, in case the selected value is not in the list of options */
  getOptions():Option<T>[] {
    const hasValue = this.props.options.find(o => isEqual(o[1], this.props.value))
    return hasValue
      ? this.props.options
      : [[this.props.value ? 'Unknown value' : '', this.props.value, true] as Option<T>, ...this.props.options]
  }

  selectedIndex(): number {
    return this.getOptions().findIndex(o => isEqual(o[1], this.props.value))
  }
}

export default SelectField
