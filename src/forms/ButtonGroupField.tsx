import * as React   from 'react'
import * as c       from 'classnames'
import InputWrapper from '../forms/InputWrapper'
import * as form    from '../forms/form.less'
import * as styles   from './ButtonGroup.less'
import {InputProps, WrappedInputProps, FieldProps, FieldRenderProps, makeConcreteField} from './FieldTypes'

type ButtonGroupFieldProps = FieldProps<WrappedButtonGroupInputProps>

class ButtonGroupField extends React.Component<ButtonGroupFieldProps> {
  render() {
    const Field = makeConcreteField<WrappedButtonGroupInputProps>()
    return (
      <Field
        className={this.props.className}
        component={this.renderComponent}
        disabled={this.props.disabled}
        fullWidth={this.props.fullWidth}
        inputClassName={this.props.inputClassName}
        label={this.props.label}
        large={this.props.large}
        name={this.props.name}
        onChange={this.props.onChange}
        options={this.props.options}
        required={this.props.required}
        tooltip={this.props.tooltip}
      />
    )
  }

  renderComponent(props: FieldRenderProps<WrappedButtonGroupInputProps, string>) {
    return (
      <WrappedButtonGroupInput
        {...props.input}
        className={props.className}
        disabled={props.disabled}
        error={props.meta.touched && props.meta.error}
        fullWidth={props.fullWidth}
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

type WrappedButtonGroupInputProps = WrappedInputProps<ButtonGroupInputProps>

export class WrappedButtonGroupInput extends React.Component<WrappedButtonGroupInputProps> {
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
        <ButtonGroupInput
          disabled={this.props.disabled}
          inputClassName={this.props.inputClassName}
          onChange={this.props.onChange}
          options={this.props.options}
          value={this.props.value}
        />
      </InputWrapper>
    )
  }
}

interface ButtonGroupInputProps {
  value?: string
  onChange?(value:string):void
  className?: string
  inputClassName?: string
  options: ButtonOptions[]
  disabled?: boolean
}

interface ButtonOptions extends Array<any> {
  /** Label */
  0: string
  /** Value */
  1: string
  /** Disabled */
  2: boolean
}

export class ButtonGroupInput extends React.Component<ButtonGroupInputProps> {
  onSelectedChange = (e:React.FormEvent<HTMLInputElement>) => {
    const {value} = e.currentTarget
    if (this.props.onChange) this.props.onChange(value)
  }

  render() {
    const { className, inputClassName, options, value:selected} = this.props

    return <div className={c(styles.buttonGroupWrapper, className)}>
      {options.map((o, idx) => {
        const [label, value, disabled] = o
        return <label htmlFor={value} key={value} className={styles.buttonGroupItem}>
          <input
            className={String(inputClassName) + idx}
            type="radio"
            id={value}
            value={value}
            checked={selected === value}
            onChange={this.onSelectedChange}
            disabled={disabled || this.props.disabled} // disabled per button or the whole component being disabled
          />
          <span className={styles.buttonGroupLabel}>{label}</span>
        </label>
      })}
    </div>
  }
}

export default ButtonGroupField