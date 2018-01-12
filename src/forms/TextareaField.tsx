import * as React   from 'react'
import * as c       from 'classnames'
import AutoTextArea, { TextareaAutosizeProps } from 'react-textarea-autosize'
import InputWrapper from '../forms/InputWrapper'
import * as form    from '../forms/form.less'
import {InputProps, WrappedInputProps, FieldProps, FieldRenderProps, makeConcreteField} from './FieldTypes'

type TextareaFieldProps = FieldProps<WrappedTextareaInputProps>

class TextareaField extends React.Component<TextareaFieldProps> {
  render() {
    const Field = makeConcreteField<WrappedTextareaInputProps>()
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
        minRows={this.props.minRows}
        name={this.props.name}
        required={this.props.required}
        tooltip={this.props.tooltip}
      />
    )
  }

  renderComponent(props: FieldRenderProps<WrappedTextareaInputProps, string>) {
    return (
      <WrappedTextareaInput
        {...props.input}
        autoFocus={props.autoFocus}
        className={props.className}
        disabled={props.disabled}
        error={props.meta.touched && props.meta.error}
        fullWidth={props.fullWidth}
        inputClassName={props.inputClassName}
        label={props.label}
        large={props.large}
        minRows={props.minRows}
        required={props.required}
        tooltip={props.tooltip}
      />
    )
  }
}

type WrappedTextareaInputProps = WrappedInputProps<TextAreaInputProps>

export class WrappedTextareaInput extends React.Component<WrappedTextareaInputProps> {

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
        <TextareaInput
          autoFocus={this.props.autoFocus}
          className={c(form.textarea, {[form.inputInvalid]: !!this.props.error}, this.props.inputClassName)}
          disabled={this.props.disabled}
          minRows={this.props.minRows || 3}
          name={this.props.name}
          onBlur={this.props.onBlur}
          onChange={this.props.onChange}
          onDragStart={this.props.onDragStart}
          onDrop={this.props.onDrop}
          onFocus={this.props.onFocus}
          value={this.props.value}
        />
      </InputWrapper>
    )
}
}

// We don't define our own input component since we don't actually do anything with it
type TextAreaInputProps = TextareaAutosizeProps
export const TextareaInput = AutoTextArea

export default TextareaField
