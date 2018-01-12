import * as React   from 'react'
import * as c       from 'classnames'
import InputWrapper from '../forms/InputWrapper'
import * as form    from '../forms/form.less'
import * as styles  from  '../forms/CheckBox.less'
import {InputProps, WrappedInputProps, FieldProps, FieldRenderProps, makeConcreteField} from './FieldTypes'

type CheckboxFieldProps = FieldProps<WrappedCheckboxInputProps>

class CheckboxField extends React.Component<CheckboxFieldProps> {

  render() {
    const Field = makeConcreteField<WrappedCheckboxInputProps>()
    return (
      <Field
        className={this.props.className}
        component={this.renderComponent}
        checkboxLabel={this.props.checkboxLabel}
        disabled={this.props.disabled}
        inputClassName={this.props.inputClassName}
        large={this.props.large}
        name={this.props.name}
        onChange={this.props.onChange}
        label={this.props.label}
        required={this.props.required}
        tooltip={this.props.tooltip}
        id={this.props.id}
      />
    )
  }

  renderComponent(props: FieldRenderProps<WrappedCheckboxInputProps>) {
    return (
      <WrappedCheckboxInput
        {...props.input}
        className={props.className}
        disabled={props.disabled}
        error={props.meta.touched && props.meta.error}
        id={props.id}
        inputClassName={props.inputClassName}
        large={props.large}
        label={props.label}
        checkboxLabel={props.checkboxLabel}
        required={props.required}
        tooltip={props.tooltip}
      />
    )
  }
}

type WrappedCheckboxInputProps = WrappedInputProps<CheckboxInputProps> & {checkboxLabel: string}

export class WrappedCheckboxInput extends React.Component<WrappedCheckboxInputProps> {

  render() {
    return (
      <InputWrapper
        className={c(this.props.className, {[form.large]: this.props.large})}
        error={this.props.error}
        required={this.props.required}
        tooltip={this.props.tooltip}
        label={this.props.label}
        checkboxLabel={this.props.checkboxLabel}
      >
        <CheckboxInput
          id={this.props.id}
          checked={this.props.checked || !!this.props.value}
          className={this.props.inputClassName}
          disabled={this.props.disabled}
          name={this.props.name}
          onBlur={this.props.onBlur}
          onChange={this.props.onChange}
          onDragStart={this.props.onDragStart}
          onDrop={this.props.onDrop}
          onFocus={this.props.onFocus}
          value={this.props.value}
        />
      </InputWrapper>
    )
  }
}

type CheckboxInputProps = InputProps<'input', string>

export class CheckboxInput extends React.Component<CheckboxInputProps> {
  render() {
    return (
      <div className={form.inputRightMargin}>
        <input {...this.props} type="checkbox" className={styles.checkbox} />
        <label className={styles.checkboxLabel} htmlFor={this.props.id}>
          <span className={c(styles.customCheckbox, this.props.className)}/>
        </label>
      </div>
    )
  }
}

export default CheckboxField
