import * as React   from 'react'
import { Link }     from 'react-router'
import * as c       from 'classnames'
import Select       from 'react-select'
import InputWrapper from '../forms/InputWrapper'
import * as form    from '../forms/form.less'
import {InputProps, WrappedInputProps, FieldProps, FieldRenderProps, makeConcreteField} from './FieldTypes'

export interface MultiSelectEntry {
  label: string
  value: string
  clearableValue?: boolean
}

type MultiselectFieldProps = FieldProps<WrappedMultiSelectInputProps>

class MultiSelectField extends React.Component<MultiselectFieldProps> {
  render() {
    const Field = makeConcreteField<WrappedMultiSelectInputProps>()
    return (
      <Field
        autoFocus={this.props.autoFocus}
        className={this.props.className}
        component={this.renderComponent}
        disabled={this.props.disabled}
        clearable={this.props.clearable}
        fullWidth={this.props.fullWidth}
        inputClassName={this.props.inputClassName}
        label={this.props.label}
        large={this.props.large}
        multi={this.props.multi}
        name={this.props.name}
        options={this.props.options}
        placeholder={this.props.placeholder}
        required={this.props.required}
        tooltip={this.props.tooltip}
      />
    )
  }

  renderComponent(props: FieldRenderProps<WrappedMultiSelectInputProps, string[]>) {
    return (
      <WrappedMultiSelectInput
        {...props.input}
        autoFocus={props.autoFocus}
        className={props.className}
        disabled={props.disabled}
        clearable={props.clearable}
        error={props.meta.touched && props.meta.error}
        fullWidth={props.fullWidth}
        inputClassName={props.inputClassName}
        label={props.label}
        large={props.large}
        multi={props.multi}
        options={props.options}
        placeholder={props.placeholder}
        required={props.required}
        tooltip={props.tooltip}
      />
    )
  }
}

type WrappedMultiSelectInputProps = WrappedInputProps<MultiSelectInputProps>

export class WrappedMultiSelectInput extends React.Component<WrappedMultiSelectInputProps> {
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
        <MultiSelectInput
          autoFocus={this.props.autoFocus}
          className={c({[form.inputInvalid]: !!this.props.error}, this.props.inputClassName)}
          disabled={this.props.disabled}
          clearable={this.props.clearable}
          multi={this.props.multi}
          name={this.props.name}
          onChange={this.props.onChange}
          options={this.props.options}
          placeholder={this.props.placeholder}
          value={this.props.value}
        />
      </InputWrapper>
    )
  }
}

interface State {
  values: string[]
}

interface MultiSelectInputProps {
  autoFocus?:     boolean
  multi?:         boolean
  options:        MultiSelectEntry[]
  placeholder?:   string
  noResultsText?: string

  onChange?(value: string[]): void
  className?: string
  disabled?: boolean
  clearable?: boolean
  value?: string[]
  name?: string
}

export class MultiSelectInput extends React.Component<MultiSelectInputProps, State> {
  state = {values: []}

  render() {
    const { name, className, disabled, onChange, placeholder, value, options, noResultsText, clearable } = this.props
    return (
      <Select
        name={name}
        className={className}
        multi={true}
        placeholder={placeholder}
        value={value || this.state.values}
        disabled={disabled}
        clearable={clearable}
        onChange={this.handleChange}
        options={options}
        noResultsText={noResultsText}
      />
    )
  }

  handleChange = (options: MultiSelectEntry[]) => {
    const { onChange } = this.props
    const newValues = options.map(o => o.value)
    this.setState({values: newValues})

    if (onChange) onChange(newValues)
  }
}

export default MultiSelectField
