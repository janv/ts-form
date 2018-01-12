import * as React     from 'react'
import * as c         from 'classnames'
import * as moment    from 'moment'
import * as TimeInputComponent from 'time-input'

import InputWrapper   from './InputWrapper'
import Icon           from '../Icon'
import * as styles    from './DateTimepicker.less'
import * as form      from './form.less'
import {InputProps, WrappedInputProps, FieldProps, FieldRenderProps, makeConcreteField} from './FieldTypes'

type TimeFieldProps = FieldProps<WrappedTimeInputProps>

class TimeField extends React.Component<TimeFieldProps> {
  render() {
    const Field = makeConcreteField<WrappedTimeInputProps>()
    return (
      <Field
        className={this.props.className}
        component={this.renderComponent}
        disabled={this.props.disabled}
        inputClassName={this.props.inputClassName}
        label={this.props.label}
        small={this.props.small}
        name={this.props.name}
        required={this.props.required}
        tooltip={this.props.tooltip}
      />
    )
  }

  renderComponent(props: FieldRenderProps<WrappedTimeInputProps>) {
    return (
      <WrappedTimeInput
        {...props.input}
        className={props.className}
        disabled={props.disabled}
        error={props.meta.touched && props.meta.error}
        inputClassName={props.inputClassName}
        label={props.label}
        small={props.small}
        required={props.required}
        tooltip={props.tooltip}
      />
    )
  }
}

type WrappedTimeInputProps = WrappedInputProps<TimeInputProps> & {small?: boolean }

export class WrappedTimeInput extends React.Component<WrappedTimeInputProps> {
  render() {
    return (
      <InputWrapper
        className={c(this.props.className, {[form.small]: this.props.small})}
        error={this.props.error}
        label={this.props.label}
        required={this.props.required}
        tooltip={this.props.tooltip}
      >
        <TimeInput
          className={this.props.inputClassName}
          disabled={this.props.disabled}
          name={this.props.name}
          onChange={this.props.onChange}
          showErrors={!!this.props.error}
          value={this.props.value}
        />
      </InputWrapper>
    )
  }
}

interface TimeInputProps {
  className?: string
  disabled?: boolean
  value?: string
  name?: string
  onChange?(value:string):void

  showErrors?:  boolean
  clearable?:   boolean
}

export class TimeInput extends React.Component<TimeInputProps, {}> {
  static defaultProps = { clearable: true }

  render() {
    const { className, clearable, value, disabled} = this.props

    return (
      <div className={styles.dateTimepicker}>
        <TimeInputComponent
          // The className is applied to the input container
          // The input itself has the class TimeInput-input and cannot be extended
          className={c(
            styles.timePicker,
            styles.timePickerLeftBorder,
            styles.timePickerFullWidth,
            {
              [styles.timePickerDisabled]: disabled,
              ['dateTimeInvalid']: !!this.props.showErrors,
              [`${className}Time`]: !!className
            })}
          value={value}
          onChange={this.props.onChange}
        />
        {clearable && !disabled && <Icon onClick={this.clearValues} name="times" className={styles.reset} />}
      </div>
    )
  }

  clearValues = () => {
    if (this.props.onChange) this.props.onChange('')
  }
}

export default TimeField
