import * as React      from 'react'
import DatePicker      from 'react-datepicker'
import * as c          from 'classnames'
import * as moment     from 'moment'

import InputWrapper   from '../forms/InputWrapper'
import 'react-datepicker/dist/react-datepicker.css'
import './Datepicker.less'
import * as form      from '../forms/form.less'
import {InputProps, WrappedInputProps, FieldProps, FieldRenderProps, makeConcreteField} from './FieldTypes'

type DateFieldProps = FieldProps<WrappedDateInputProps>

class DateField extends React.Component<DateFieldProps> {
  render() {
    const Field = makeConcreteField<WrappedDateInputProps>()
    return (
      <Field
        autoFocus={this.props.autoFocus}
        className={this.props.className}
        clearable={this.props.clearable}
        component={this.renderComponent}
        disabled={this.props.disabled}
        endDate={this.props.endDate}
        floatLabel={this.props.floatLabel}
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

  renderComponent(props: FieldRenderProps<WrappedDateInputProps>) {
    return (
      <WrappedDateInput
        {...props.input}
        autoFocus={props.autoFocus}
        className={props.className}
        clearable={props.clearable}
        disabled={props.disabled}
        endDate={props.endDate}
        error={props.meta.touched && props.meta.error}
        floatLabel={props.floatLabel}
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

type WrappedDateInputProps = WrappedInputProps<DateInputProps>

export class WrappedDateInput extends React.Component<WrappedDateInputProps> {
  render() {
    return (
      <InputWrapper
        className={c(this.props.className, {[form.large]: this.props.large})}
        error={this.props.error}
        pushLabelDown={this.props.floatLabel ? !this.props.value : false}
        label={this.props.label}
        required={this.props.required}
        tooltip={this.props.tooltip}
      >
        <DateInput
          autoFocus={this.props.autoFocus}
          className={this.props.inputClassName}
          clearable={this.props.clearable}
          disabled={this.props.disabled}
          endDate={this.props.endDate}
          maxDate={this.props.maxDate}
          minDate={this.props.minDate}
          name={this.props.name}
          onBlur={this.props.onBlur}
          onChange={this.props.onChange}
          onFocus={this.props.onFocus}
          placeholder={this.props.placeholder}
          showErrors={!!this.props.error}
          startDate={this.props.startDate}
          value={this.props.value}
        />
      </InputWrapper>
    )
  }
}

interface DateInputProps {
  className?: string
  disabled?: boolean
  value?: number
  name?: string
  onBlur?(value?:number):void
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onChange?(value:number|null):void

  autoFocus?:   boolean
  endDate?:     moment.Moment
  maxDate?:     moment.Moment
  minDate?:     moment.Moment
  placeholder?: string
  showErrors?:  boolean
  startDate?:   moment.Moment
  clearable?:   boolean
}

interface DateInputState {
  date: moment.Moment | null
}

export class DateInput extends React.Component<DateInputProps, DateInputState> {
  static defaultProps = { clearable: true }
  state = {date: this.parse(this.props.value)}

  componentWillReceiveProps(nextProps: DateInputProps) {
    const nextDate = this.parse(nextProps.value)
    if (nextDate !== this.state.date) {
      this.setState({date: nextDate})
    }
  }

  render() {
    return (
      <DatePicker
        placeholderText={this.props.placeholder}
        className={c(form.input, this.props.className)}
        disabled={this.props.disabled}
        endDate={this.props.endDate}
        maxDate={this.props.maxDate}
        minDate={this.props.minDate}
        name={this.props.name}
        onBlur={this.handleBlur}
        onFocus={this.props.onFocus}
        onChange={this.handleChange}
        locale={moment.locale()}
        selected={this.state.date || undefined}
        startDate={this.props.startDate}
        isClearable={this.props.clearable}
      />
    )
  }

  handleBlur = () => {
    if (this.props.onBlur) this.props.onBlur(this.props.value)
  }

  handleChange = (date: moment.Moment) => {
    const formattedDate = this.format(date)

    this.setState({date: date})
    if (this.props && this.props.onChange) this.props.onChange(formattedDate)
  }

  parse(value?: number): moment.Moment | null {
    return value ? moment(value) : null
  }

  format(date: moment.Moment): number | null {
    return date ? date.valueOf() : null
  }
}

export default DateField
