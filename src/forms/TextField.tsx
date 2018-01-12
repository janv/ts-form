import * as React   from 'react'
import * as c       from 'classnames'
import InputWrapper from '../forms/InputWrapper'
import * as form    from '../forms/form.less'
import {InputProps, WrappedInputProps, FieldProps, FieldRenderProps, makeConcreteField} from './FieldTypes'

type TextFieldProps = FieldProps<WrappedTextInputProps>

class TextField extends React.Component<TextFieldProps> {

  render() {
    const Field = makeConcreteField<WrappedTextInputProps>()
    return (
      <Field
        autoFocus={this.props.autoFocus}
        className={this.props.className}
        component={this.renderComponent}
        disabled={this.props.disabled}
        floatLabel={this.props.floatLabel}
        fullWidth={this.props.fullWidth}
        inputClassName={this.props.inputClassName}
        label={this.props.label}
        large={this.props.large}
        name={this.props.name}
        onChange={this.props.onChange}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        placeholder={this.props.placeholder}
        required={this.props.required}
        tooltip={this.props.tooltip}
        type={this.props.type}
      />
    )
  }

  renderComponent(props: FieldRenderProps<WrappedTextInputProps, string>) {
    return (
      <WrappedTextInput
        {...props.input}
        autoFocus={props.autoFocus}
        className={props.className}
        disabled={props.disabled}
        error={(props.meta.touched || props.meta.dirty) && props.meta.error}
        floatLabel={props.floatLabel}
        fullWidth={props.fullWidth}
        inputClassName={props.inputClassName}
        label={props.label}
        large={props.large}
        placeholder={props.placeholder}
        required={props.required}
        tooltip={props.tooltip}
        type={props.type}
      />
    )
  }
}

type WrappedTextInputProps = WrappedInputProps<TextInputProps>

export class WrappedTextInput extends React.Component<WrappedTextInputProps> {

  render() {
    return (
      <InputWrapper
        className={c(this.props.className, {
          [form.large]: this.props.large,
          [form.full]: this.props.fullWidth
        })}
        error={this.props.error}
        pushLabelDown={this.props.floatLabel ? !this.props.value : false}
        label={this.props.label}
        required={this.props.required}
        tooltip={this.props.tooltip}
      >
        <TextInput
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
          type={this.props.type || "text"}
          value={this.props.value}
        />
      </InputWrapper>
    )
  }
}

type TextInputProps = InputProps<'input', string>
export class TextInput extends React.Component<TextInputProps> {
  render() {
    return <input {...this.props} className={c(form.input, this.props.className)} />
  }
}

export default TextField
