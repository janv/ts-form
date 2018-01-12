import * as React   from 'react'
import * as c       from 'classnames'
import Icon         from '../Icon'
import InputWrapper from '../forms/InputWrapper'
import * as style   from './SearchBar.less'
import * as form    from '../forms/form.less'
import {InputProps, WrappedInputProps, FieldProps, FieldRenderProps, makeConcreteField} from './FieldTypes'

type SearchFieldProps = FieldProps<WrappedSearchInputProps>

class SearchField extends React.Component<SearchFieldProps> {
  render() {
    const Field = makeConcreteField<WrappedSearchInputProps>()
    return (
      <Field
        autoFocus={this.props.autoFocus}
        className={this.props.className}
        component={this.renderComponent}
        disabled={this.props.disabled}
        floatLabel={this.props.floatLabel}
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

  renderComponent(props: FieldRenderProps<WrappedSearchInputProps>) {
    return (
      <WrappedSearchInput
        {...props.input}
        autoFocus={props.autoFocus}
        className={props.className}
        disabled={props.disabled}
        error={props.meta.touched && props.meta.error}
        floatLabel={props.floatLabel}
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

type WrappedSearchInputProps = WrappedInputProps<SearchInputProps>

export class WrappedSearchInput extends React.Component<WrappedSearchInputProps> {
  render() {
    return (
      <InputWrapper
        className={c(this.props.className, {
          [form.large]: this.props.large,
          [form.full]: this.props.fullWidth
        })}
        error={this.props.error}
        pushLabelDown={this.props.floatLabel ? !this.props.value : false}
        label={this.props.label}
        required={this.props.required}
        tooltip={this.props.tooltip}
      >
        <SearchInput
          autoFocus={this.props.autoFocus}
          className={this.props.inputClassName}
          name={this.props.name}
          onChange={this.props.onChange}
          placeholder={this.props.placeholder}
          value={this.props.value}
        />
      </InputWrapper>
    )
  }
}

interface SearchInputProps {
  autoFocus?: boolean
  defaultValue?: string
  floatLabel?:  boolean
  placeholder?: string
  onChange?(value: string): void

  value?: string
  className?: string
  name?: string
}

interface State {
  searchTerm: string
}

export class SearchInput extends React.Component<SearchInputProps, State> {
  state = {searchTerm: ''}

  componentDidMount(){
    const {defaultValue} = this.props

    if (defaultValue) {
      this.setSearchTerm(defaultValue)
    }
  }

  componentWillReceiveProps(nextProps: SearchInputProps) {
    if(nextProps.value !== this.props.value) {
      this.setSearchTerm(nextProps.value || '')
    }
  }

  render() {
      const {name, autoFocus, className, placeholder} = this.props
      const {searchTerm} = this.state

      return (
        <div className={style.searchContainer}>
          <input type="search" autoComplete="off" placeholder={placeholder} value={searchTerm} name={name}
            className={c(form.input, style.search, className)} onChange={this.changeHandler} autoFocus={autoFocus}/>
          <Icon name="search" className={style.searchIcon}/>
          {searchTerm && <Icon name="remove close" className={style.clearIcon} onClick={this.clearValue}/>}
        </div>
      )
    }

    clearValue = (): void => {
      this.setSearchTerm('')
    }

    changeHandler = (e: React.FormEvent<HTMLInputElement>) => {
      this.setSearchTerm(e.currentTarget.value)
    }

    setSearchTerm(searchTerm: string) {
      const { onChange } = this.props

      this.setState({
        searchTerm: searchTerm
      })

      if (onChange) onChange(searchTerm)
    }
}

export default SearchField
