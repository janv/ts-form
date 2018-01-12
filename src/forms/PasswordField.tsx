import * as React   from 'react'
import Tooltip      from 'rc-tooltip'
import * as zxcvbnT from 'zxcvbn'
import * as c       from 'classnames'
import InputWrapper from '../forms/InputWrapper'
import * as form    from '../forms/form.less'
import {InputProps, WrappedInputProps, FieldProps, FieldRenderProps, makeConcreteField} from './FieldTypes'

type PasswordFieldProps = FieldProps<WrappedPasswordInputProps>

var zxcvbn:zxcvbnT

class PasswordField extends React.Component<PasswordFieldProps> {

  render() {
    const Field = makeConcreteField<WrappedPasswordInputProps>()
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
        onChange={this.props.onChange}
        placeholder={this.props.placeholder}
        required={this.props.required}
        tooltip={this.props.tooltip}
      />
    )
  }

  renderComponent(props: FieldRenderProps<WrappedPasswordInputProps, string>) {
    return (
      <WrappedPasswordInput
        {...props.input}
        autoFocus={props.autoFocus}
        className={props.className}
        disabled={props.disabled}
        error={props.meta.touched && props.meta.error}
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

type WrappedPasswordInputProps = WrappedInputProps<PasswordInputProps>

export class WrappedPasswordInput extends React.Component<WrappedPasswordInputProps> {
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
        <PasswordInput
          autoFocus={this.props.autoFocus}
          className={c(form.input, {[form.inputInvalid]: !!this.props.error}, this.props.inputClassName)}
          disabled={this.props.disabled}
          name={this.props.name}
          onBlur={this.props.onBlur}
          onChange={this.props.onChange}
          onDragStart={this.props.onDragStart}
          onDrop={this.props.onDrop}
          onFocus={this.props.onFocus}
          placeholder={this.props.placeholder}
          value={this.props.value}
        />
      </InputWrapper>
    )
  }
}

interface PasswordState {
  suggestions: {
    message: string
    visible: boolean
  }
}

type PasswordInputProps = InputProps<'input', string>

export class PasswordInput extends React.Component<PasswordInputProps> {
  state = {
    suggestions: {
      message: '',
      visible: false
    }
  }

  componentWillMount() {
    require.ensure([], function(require) {
      zxcvbn = require('zxcvbn')
    }, 'zxcvbn')
  }

  render() {
    const { message, visible } = this.state.suggestions
    return (
      <Tooltip placement="right" trigger={['focus']} overlay={message} visible={visible}>
        <input {...this.props}
          onBlur={this.passwordBlurHandler}
          onChange={this.passwordInputHandler}
          type="password"
        />
      </Tooltip>
    )
  }

  passwordInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value && zxcvbn) {
      const result = zxcvbn(event.currentTarget.value)

      if (result.score <= 2) {
        const message = result.feedback.warning
          ? `${result.feedback.warning}. ${result.feedback.suggestions}`
          : result.feedback.suggestions
        this.setState({suggestions: {message, visible: true}})
      }
    }

    if (this.props.onChange) this.props.onChange(event)
  }

  passwordBlurHandler = () => {
    this.setState({suggestions: {message: '', visible: false}})
  }
}

export default PasswordField
