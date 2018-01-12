import * as React   from 'react'
import * as c       from 'classnames'
import InputWrapper from '../forms/InputWrapper'
import * as styles  from './Radio.less'
import * as form    from '../forms/form.less'
import {InputProps, WrappedInputProps, FieldProps, FieldRenderProps, makeConcreteField} from './FieldTypes'

// Please note: the radio input can have its own value attribute
// Redux-form provides current field value through InputProps
// The radio should be checked only when these two values match
// For clarity we are renaming the radio value radioValue

interface ExternalCustomProps {
  description?: string
  radioLabel:   string
  radioValue:   string
}

type RadioFieldProps = FieldProps<WrappedRadioInputProps & ExternalCustomProps>

class RadioField extends React.Component<RadioFieldProps> {
  render() {
    const Field = makeConcreteField<WrappedRadioInputProps & ExternalCustomProps>()
    return (
      <Field
        className={this.props.className}
        component={this.renderComponent}
        description={this.props.description}
        disabled={this.props.disabled}
        inputClassName={this.props.inputClassName}
        large={this.props.large}
        name={this.props.name}
        onChange={this.props.onChange}
        radioLabel={this.props.radioLabel}
        radioValue={this.props.radioValue}
        required={this.props.required}
        tooltip={this.props.tooltip}
      />
    )
  }

  renderComponent(props: FieldRenderProps<WrappedRadioInputProps & ExternalCustomProps, string>) {
    return (
      <WrappedRadioInput
        {...props.input}
        checked={props.radioValue === props.input.value}
        className={props.className}
        disabled={props.disabled}
        inputClassName={props.inputClassName}
        description={props.description}
        error={props.meta.touched && props.meta.error}
        large={props.large}
        label={props.radioLabel}
        required={props.required}
        tooltip={props.tooltip}
        value={props.radioValue}
      />
    )
  }
}

type WrappedRadioInputProps = WrappedInputProps<RadioInputProps>

export class WrappedRadioInput extends React.Component<WrappedRadioInputProps> {
  render() {
    return (
      <InputWrapper
        className={c(this.props.className, {[form.large]: this.props.large})}
        error={this.props.error}
        required={this.props.required}
        tooltip={this.props.tooltip}
        hideLabel
      >
        <RadioInput
          checked={this.props.checked}
          className={this.props.inputClassName}
          description={this.props.description}
          disabled={this.props.disabled}
          name={this.props.name}
          onChange={this.props.onChange}
          label={this.props.label}
          value={this.props.value}
        />
      </InputWrapper>
    )
  }
}

interface RadioInputProps {
  checked?:     boolean
  description?: string
  label?:        string
  disabled?: boolean
  name?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  value?: string
  className?: string
}

export class RadioInput extends React.Component<RadioInputProps> {
  render() {
    const { description, label } = this.props

    return (
      <label className={styles.radioWrapper}>
        <input
          type="radio"
          checked={this.props.checked}
          className={styles.radio}
          disabled={this.props.disabled}
          name={this.props.name}
          onChange={this.props.onChange}
          value={this.props.value}
        />
        <div className={styles.radioLabel}>
          <span className={styles.customRadio}/>
          { label && (
            <span className={c(
              styles.radioLabelText,
              this.props.className,
              {[styles.withDescription]: description} as ClassValue)}
            >
              { label }
              { description && (
                <div className={styles.radioLabelDescription}>
                  { description }
                </div>
              )}
            </span>
          )}
        </div>
      </label>
    )
  }
}

export default RadioField
