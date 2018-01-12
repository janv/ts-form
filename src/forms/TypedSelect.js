/* @flow */
import React from 'react'
import isEqual from 'lodash/isEqual'
import c from 'classnames'
import formStyles from './form.less'
import {FormField} from './Form'
import _ from 'lodash'

type Props<T> = {
    value: T,
    options: Array<[string, T]>,
    className?: any,
    onChange?: (v: T) => void,
    onBlur?: (v: T) => void,
    className?: string,
    readOnly?: boolean,
}

// Usage:
//
// <TypedSelect
//   options={[['Foo', foo], ['Bar', bar]]}
//   value={foo}/>

export default class TypedSelect<T> extends React.Component<void, Props<T>, void> {
  componentDidMount() {
    const selectedIndex = this.selectedIndex()
    const {options, onChange} = this.props
    // value is invalid, fire onChange with the first option
    if (selectedIndex < 0 && options.length > 0 && onChange) {
      onChange(options[0][1])
    }
  }

  render(): React.Element<any> {
    const selectedIndex = this.selectedIndex()
    return <select {...this.props}
              value={selectedIndex}
              className={c(formStyles.input, this.props.className)}
              onBlur={e => this.onBlur(e.target.value)}
              onChange={e => this.onChange(e.target.value)}
              disabled={this.props.readOnly}>
      {this.props.options.map(
        (option, i) => <option key={i} value={i}>{option[0]}</option>
      )}
    </select>
  }

  onChange(s: string) {
    const i = parseInt(s, 10)
    const option = this.props.options[i]
    const value: T = option[1]
    if (this.props.onChange) this.props.onChange(value)
  }

  onBlur(s: string) {
    const i = parseInt(s, 10)
    const option = this.props.options[i]
    const value: T = option[1]
    if (this.props.onBlur) this.props.onBlur(value)
  }

  selectedIndex(): number {
    const {options, value} = this.props
    for (var i = 0, len = options.length; i < len; i++) {
      if (isEqual(options[i][1], value)) {
        return i
      }
    }
    return -1
  }
}

export class TypedSelectTwo extends React.Component {
  render(){
    return <FormField
      path={this.props.path}
      format={this.format}
      parse={this.parse}
      render={({onChange, value}) => <select
        value={value}
        className={c(formStyles.input, this.props.className)}
        disabled={this.props.readOnly}
        onChange={e=>onChange(e.target.value)}
      >
        {this.props.options.map(
          (option, i) => <option key={i} value={i}>{option[0]}</option>)}
      </select>}
    />
  }

  format = (modelValue) => {
    return _.findIndex(this.props.options, option => isEqual(option[1], modelValue))
  }

  parse = (viewValue) => {
    return this.props.options[viewValue][1]
  }
}
