import * as React   from 'react'
import { Link }     from 'react-router'
import * as c       from 'classnames'
import * as Select from 'react-select'
import InputWrapper from '../forms/InputWrapper'
import * as form    from '../forms/form.less'
import {InputProps, WrappedInputProps, FieldProps, FieldRenderProps, makeConcreteField} from './FieldTypes'

import './MultiSelect.less'

export interface AutoCompleteEntry {
  label: string
  value: string
}

type TagFieldProps = FieldProps<WrappedTagInputProps>

class TagField extends React.Component<TagFieldProps> {
  render() {
    const Field = makeConcreteField<WrappedTagInputProps>()
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
        multi={this.props.multi}
        name={this.props.name}
        options={this.props.options}
        placeholder={this.props.placeholder}
        required={this.props.required}
        tooltip={this.props.tooltip}
      />
    )
  }

  renderComponent(props: FieldRenderProps<WrappedTagInputProps>) {
    return (
      <WrappedTagInput
        {...props.input}
        autoFocus={props.autoFocus}
        className={props.className}
        disabled={props.disabled}
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

type WrappedTagInputProps = WrappedInputProps<TagInputProps>

export class WrappedTagInput extends React.Component<WrappedTagInputProps> {

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
        <TagInput
          autoFocus={this.props.autoFocus}
          className={c({[form.inputInvalid]: !!this.props.error}, this.props.inputClassName)}
          createLabel={this.props.createLabel}
          disabled={this.props.disabled}
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

interface TagInputProps {
  autoFocus?:   boolean
  createLabel?: string
  multi?:       boolean
  noResultsText?: string
  options?:     AutoCompleteEntry[]
  placeholder?: string

  value?: string | string[]
  onChange?(value: string|string[]):void

  className?: string
  disabled?: boolean
  name?: string
}

interface TagInputState {
  value:    string | string[]
  options:  AutoCompleteEntry[]
}

export class TagInput extends React.Component<TagInputProps, TagInputState> {
  state = { value: '', options: [] }

  componentDidMount() {
    this.initInput(this.props)
  }

  componentWillReceiveProps(nextProps: TagInputProps) {
    this.initInput(nextProps)
  }

  initInput = (props: TagInputProps) => {
    const options: AutoCompleteEntry[] = props.options || []
    let finalOptions: AutoCompleteEntry[] = []
    let value:string[]

    if (props.multi) {
      value = Array.isArray(props.value) ? props.value : []
    } else {
      value = typeof props.value === 'string' ? [props.value] : []
    }

    if (value) {
      const valueOptions = value.map((key: string) => ({value: key, label: key}))
      finalOptions = finalOptions.concat(valueOptions)
    }

    if (options.length > 0) {
      finalOptions = finalOptions.concat(options)
    }

    this.setState({options: finalOptions})
  }

  handleChange = (value: AutoCompleteEntry | AutoCompleteEntry[]) => {
    const { onChange, multi } = this.props
    let newValue:string|string[]

    // on clear of a non-multi value the underlying component returns null
    if (value === null) {
      newValue = ''
    } else if (multi) {
      newValue = (value as AutoCompleteEntry[]).map(o => o.value)
    } else {
      newValue = (value as AutoCompleteEntry).value
    }

    this.setState({value: newValue})
    if (onChange) onChange(newValue)
  }

  promptTextCreator = (label: string) => {
    const createLabel = this.props.createLabel || 'Create option'
    return `${createLabel}: "${label}"`
  }

  isValidNewOption = (arg: { label?: string }) => {
    if (arg.label) return arg.label.trim().length > 0

    return false
  }

  render() {
    const { autoFocus, className, disabled, multi, name, noResultsText, onChange, placeholder, value } = this.props
    return (
      <Select.Creatable
        autofocus={autoFocus}
        className={className}
        disabled={disabled}
        isValidNewOption={this.isValidNewOption}
        multi={multi}
        name={name}
        noResultsText={noResultsText}
        onBlurResetsInput={false}
        onChange={this.handleChange}
        options={this.state.options}
        placeholder={placeholder}
        promptTextCreator={this.promptTextCreator}
        value={value || this.state.value}
      />
    )
  }
}

export default TagField
