import * as React     from 'react'
import * as c         from 'classnames'
import * as moment    from 'moment'
import * as TimeInput from 'time-input'

import { DateInput }  from './DateField'
import InputWrapper   from './InputWrapper'
import Icon           from '../Icon'
import * as styles    from './DateTimepicker.less'
import * as form      from './form.less'
import {InputProps, WrappedInputProps, FieldProps, FieldRenderProps, makeConcreteField} from './FieldTypes'

type DateTimeFieldProps = FieldProps<WrappedDateTimeInputProps>

class DateTimeField extends React.Component<DateTimeFieldProps> {

  render() {
    const Field = makeConcreteField<WrappedDateTimeInputProps>()
    return (
      <Field
        autoFocus={this.props.autoFocus}
        className={this.props.className}
        component={this.renderComponent}
        disabled={this.props.disabled}
        endDate={this.props.endDate}
        inputClassName={this.props.inputClassName}
        label={this.props.label}
        large={this.props.large}
        name={this.props.name}
        maxDate={this.props.maxDate}
        minDate={this.props.minDate}
        placeholder={this.props.placeholder}
        required={this.props.required}
        startDate={this.props.startDate}
        tooltip={this.props.tooltip}
      />
    )
  }

  renderComponent(props: FieldRenderProps<WrappedDateTimeInputProps, 'string'>) {
    return (
      <WrappedDateTimeInput
        {...props.input}
        autoFocus={props.autoFocus}
        className={props.className}
        disabled={props.disabled}
        endDate={props.endDate}
        error={props.meta.touched && props.meta.error}
        inputClassName={props.inputClassName}
        label={props.label}
        large={props.large}
        maxDate={props.maxDate}
        minDate={props.minDate}
        placeholder={props.placeholder}
        required={props.required}
        startDate={props.startDate}
        tooltip={props.tooltip}
      />
    )
  }
}

type WrappedDateTimeInputProps = WrappedInputProps<DateTimeInputProps>

export class WrappedDateTimeInput extends React.Component<WrappedDateTimeInputProps> {

  render() {
    return (
      <InputWrapper
        className={c(this.props.className, {[form.large]: this.props.large})}
        error={this.props.error}
        label={this.props.label}
        required={this.props.required}
        tooltip={this.props.tooltip}
      >
        <DateTimeInput
          autoFocus={this.props.autoFocus}
          className={this.props.inputClassName}
          disabled={this.props.disabled}
          endDate={this.props.endDate}
          maxDate={this.props.maxDate}
          minDate={this.props.minDate}
          name={this.props.name}
          onBlur={this.props.onBlur}
          onChange={this.props.onChange}
          placeholder={this.props.placeholder}
          showErrors={!!this.props.error}
          startDate={this.props.startDate}
          value={this.props.value}
        />
      </InputWrapper>
    )
  }
}

interface DateTimeInputProps {
  value?: string
  className?: string
  disabled?: boolean
  name?: string
  onBlur?(value?:string):void

  autoFocus?:   boolean
  clearable?:   boolean
  endDate?:     moment.Moment
  maxDate?:     moment.Moment
  minDate?:     moment.Moment
  placeholder?: string
  showErrors?:  boolean
  startDate?:   moment.Moment
  onChange?(value:string):void
}

interface DateTimeInputState {
  date: string
  time: string
}

export class DateTimeInput extends React.Component<DateTimeInputProps, DateTimeInputState> {
  static defaultProps = { clearable: true }
  state = {
    date: parseDate(this.props.value),
    time: parseTime(this.props.value)
  }

  componentWillReceiveProps(nextProps: DateTimeInputProps) {
    const date = parseDate(nextProps.value)
    const time = parseTime(nextProps.value)
    this.setState({date, time})
  }

  render() {
    const { className, clearable, placeholder, startDate, endDate, minDate, maxDate, disabled} = this.props
    const {date, time} = this.state

    return (
      <div className={styles.dateTimepicker}>
        <div className={styles.datePickerWrapper}>
          <DateInput
            className={c(form.input, styles.datePicker, {
              [form.inputInvalid]: !!this.props.showErrors,
              [`${className}Date`]: !!className
            })}
            clearable={false}
            disabled={disabled}
            name={this.props.name}
            placeholder={placeholder}
            onBlur={this.handleDateBlur}
            onChange={this.handleDateChange}
            startDate={startDate}
            endDate={endDate}
            minDate={minDate}
            maxDate={maxDate}
            value={Number(date)}
          />
        </div>
        <TimeInput
          // The className is applied to the input container
          // The input itself has the class TimeInput-input and cannot be extended
          className={c(styles.timePicker, {
            [styles.timePickerDisabled]: disabled,
            ['dateTimeInvalid']: !!this.props.showErrors,
            [`${className}Time`]: !!className
          })}
          value={time}
          onChange={this.handleTimeChange}
        />
        {clearable && !disabled && <Icon onClick={this.clearValues} name="times" className={styles.reset} />}
      </div>
    )
  }

  handleDateBlur = () => {
    if (this.props.onBlur) this.props.onBlur(this.props.value)
  }

  handleDateChange = (date: number) => {
    const dateValue = date ? date.toString() : ''
    this.setState({date: dateValue}, () => {
      const finalDateTime = combineDateAndTime(this.state.date, this.state.time)
      if (this.props.onChange) this.props.onChange(finalDateTime)
    })
  }

  handleTimeChange = (time: string) => {
    this.setState({time: time}, () => {
      const finalDateTime = combineDateAndTime(this.state.date, this.state.time)
      if (this.props.onChange) this.props.onChange(finalDateTime)
    })
  }

  clearValues = () => {
    this.setState({
      date: '',
      time: '00:00'
    })

    if (this.props.onChange) this.props.onChange('')
  }
}

/**
 *
 * @param isoDateTime iso string
 * @returns timestamp string
 */
function parseDate(isoDateTime?: string): string {
  return isoDateTime ? moment(isoDateTime).valueOf().toString() : ''
}

/**
 *
 * @param isoDateTime iso string
 * @returns formatted HH:mm string
 */
function parseTime(isoDateTime?: string): string {
  return isoDateTime ? moment(isoDateTime).format('HH:mm') : '00:00'
}

/**
 *
 * @param date timestamp string
 * @param time formatted HH:mm string
 * @returns ISO 8601 string
 */
function combineDateAndTime(date: string, time: string): string {
  if (date && date !== '') {
    // Redux form 5x only knows strings and booleans. Therefore we need to convert the timestamp string to int
    const fullDate = date ? moment(parseInt(date)) : moment()
    const [hours, seconds] = time ? time.split(':') : ['00', '00']

    fullDate.hours(parseInt(hours))
    fullDate.minutes(parseInt(seconds))

    return fullDate.format()
  } else {
    return ''
  }
}

export default DateTimeField
