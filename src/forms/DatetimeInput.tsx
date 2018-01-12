import * as React from 'react'
import * as moment from 'moment'
import * as c from 'classnames'
import * as Datetime from 'react-datetime'
import formatTimestamp, {defaultDateFormat, defaultTimeFormat} from '../../util/formatTimestamp'

import 'react-datetime/css/react-datetime.css'
import * as form from './form.less'

interface Props {
  value: string
  onChange: any // DatetimeInput will change, this allows correct typing with the Field by now
  placeholder?: string
  className?: string
  readOnly?: boolean
  showErrors?: boolean
  disableTime?: boolean
  disabled?: boolean
  required?: boolean
}

interface InputProps {
  className: string
  placeholder?: string
  value?: string
  disabled?: boolean
}

/**
 * DEPRECATED
 *
 * This is only used in the old rule editor somewhere. For new development, use either
 * DateField or DateTimeField
 */
export default class DatetimeInput extends React.Component<Props> {
  render() {
    if (this.props.readOnly) {
      return <input type="text" className={c(this.props.className, form.input)} value={formatTimestamp(this.props.value)} disabled/>
    }

    const {className, disabled, value, placeholder, showErrors, disableTime, required} = this.props
    const m = moment(this.props.value)
    const isValid = m.isValid()

    const validValue = isValid ? m.toDate() : undefined

    // pass any invalid input to the datetime input via props
    const inputProps: InputProps = {
      className: c(form.input, {[form.inputInvalid]: (!isValid && (required || value)) || showErrors} as ClassValue),
      placeholder, disabled
    }

    if (!isValid) {
      inputProps.value = value ? value : ''
    }

    return <Datetime
      inputProps={inputProps}
      className={c(className, form.dateWrapper)}
      onChange={this.handleChange}
      dateFormat={defaultDateFormat()}
      timeFormat={disableTime ? false : defaultTimeFormat()}
      value={validValue}
      closeOnSelect
    />
  }

  handleChange = (date: moment.Moment|string) => {
    if (typeof date === 'string') {
      this.props.onChange(date)
    } else {
      this.props.onChange(date.format())
    }
  }
}
