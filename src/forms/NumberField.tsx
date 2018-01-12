import * as React   from 'react'
import * as c       from 'classnames'
import InputWrapper from '../forms/InputWrapper'
import * as form    from '../forms/form.less'
import {WrappedInputProps, InputProps, FieldProps, FieldRenderProps, makeConcreteField} from './FieldTypes'

import normalizeNumber from '../../util/normalizeNumber'

function parse(value:string){
  return Number(value.replace(/[^0-9]/g,''))
}

type NumberFieldProps = FieldProps<WrappedNumberInputProps>

class NumberField extends React.Component<NumberFieldProps> {
  render() {
    const Field = makeConcreteField<WrappedNumberInputProps>()
    return (
      <Field
        autoFocus={this.props.autoFocus}
        className={this.props.className}
        component={this.renderComponent}
        disabled={this.props.disabled}
        fullWidth={this.props.fullWidth}
        inputClassName={this.props.inputClassName}
        label={this.props.label}
        large={this.props.large}
        name={this.props.name}
        format={normalizeNumber}
        onChange={this.props.onChange}
        parse={parse}
        placeholder={this.props.placeholder}
        required={this.props.required}
        tooltip={this.props.tooltip}
      />
    )
  }

  renderComponent(props: FieldRenderProps<WrappedNumberInputProps,string|number>) {
    return (
      <WrappedNumberInput
        {...props.input}
        autoFocus={props.autoFocus}
        className={props.className}
        disabled={props.disabled}
        error={(props.meta.touched || props.meta.dirty) && props.meta.error}
        fullWidth={props.fullWidth}
        inputClassName={props.inputClassName}
        label={props.label}
        large={props.large}
        placeholder={props.placeholder}
        required={props.required}
        tooltip={props.tooltip}
      />
    )
  }
}

type WrappedNumberInputProps = WrappedInputProps<NumberInputProps>

export class WrappedNumberInput extends React.Component<WrappedNumberInputProps> {

  render() {
    return (
      <InputWrapper
        className={c(this.props.className, {
          [form.large]: this.props.large,
          [form.full]: this.props.fullWidth
        })}
        error={this.props.error}
        label={this.props.label}
        required={this.props.required}
        tooltip={this.props.tooltip}
      >
        <NumberInput
          autoFocus={this.props.autoFocus}
          className={c({[form.inputInvalid]: !!this.props.error}, this.props.inputClassName)}
          disabled={this.props.disabled}
          name={this.props.name}
          onBlur={this.props.onBlur}
          onChange={this.props.onChange}
          onDragStart={this.props.onDragStart}
          onDrop={this.props.onDrop}
          onFocus={this.props.onFocus}
          placeholder={this.props.placeholder}
          type="text" // Number would interfere with normalise
          value={this.props.value}
        />
      </InputWrapper>
    )
  }
}

interface CustomProps {
  // This props name should be brought in line with the classes "numberAppearance",
  // but I don't know what the semantics are supposed to be, why we don't _always_
  // use numberAppearance, so I'm leaving it as it is for now:
  small?: boolean
  type?: string
}

type NumberInputProps = InputProps<'input', number|string> & CustomProps

export class NumberInput extends React.Component<NumberInputProps> {

  // Number Input parsing and formatting is managed by Field and allows nice formatting for big numbers,
  // the Rule Builder input is a real number input so we are returning different inputs according to the type prop
  render() {
    return this.props.type === 'text'
      ? <input type="text"
          className={c(form.input, this.props.className)}
          disabled={this.props.readOnly || this.props.disabled}
          onChange={this.props.onChange}
          value={this.props.value}
        />
      : <input type="number"
          className={c(
            form.input,
            {[form.numberAppearance]: this.props.small},
            this.props.className)
          }
          disabled={this.props.readOnly || this.props.disabled}
          onChange={this.props.onChange}
          value={this.props.value}
        />
  }
}

export default NumberField
