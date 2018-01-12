import * as React   from 'react'
import { Field } from 'redux-form'
import * as c       from 'classnames'
import AceEditor, { AceEditorProps } from 'react-ace'

import InputWrapper from '../forms/InputWrapper'
import * as form    from '../forms/form.less'
import {InputProps, WrappedInputProps, FieldProps, FieldRenderProps, makeConcreteField} from './FieldTypes'
import 'brace/mode/javascript'
import 'brace/theme/katzenmilch'

type CodeFieldProps = FieldProps<WrappedCodeInputProps>

class CodeField extends React.Component<CodeFieldProps> {
  render() {

    const Field = makeConcreteField<WrappedCodeInputProps>()
    return (
      <Field
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
        required={this.props.required}
        tooltip={this.props.tooltip}
      />
    )
  }

  renderComponent(props: FieldRenderProps<WrappedCodeInputProps, string>) {
    return (
      <WrappedCodeInput
        {...props.input}
        className={props.className}
        disabled={props.disabled}
        error={props.meta.touched && props.meta.error}
        floatLabel={props.floatLabel}
        fullWidth={props.fullWidth}
        inputClassName={props.inputClassName}
        label={props.label}
        large={props.large}
        required={props.required}
        tooltip={props.tooltip}
      />
    )
  }
}

type WrappedCodeInputProps = WrappedInputProps<CodeInputProps>

export class WrappedCodeInput extends React.Component<WrappedCodeInputProps> {

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
        <CodeInput
          className={c(form.codeInput, {[form.inputInvalid]: !!this.props.error}, this.props.inputClassName)}
          disabled={this.props.disabled}
          onBlur={this.props.onBlur}
          onChange={this.props.onChange}
          onFocus={this.props.onFocus}
          value={this.props.value}
        />
      </InputWrapper>
    )
  }
}

interface CodeInputProps {
  className?: string
  disabled?: boolean
  onChange?: AceEditorProps['onChange']
  onBlur?(value?: string): void
  onFocus?: React.FocusEventHandler<any> // according to https://github.com/ajaxorg/ace/blob/7fc511d0d6481378e806c25de87f7f96ca9ecbcb/lib/ace/editor.js#L668
  value?: string
}

export class CodeInput extends React.Component<CodeInputProps> {

  render() {
    return (
      <AceEditor
        className={this.props.className}
        readOnly={this.props.disabled}
        onChange={this.props.onChange as (value?:string)=>void}
        onBlur={this.handleBlur}
        onFocus={this.props.onFocus as any /*AceEditor definition is wrong*/}
        value={this.props.value}
        editorProps={{$blockScrolling: 1}}
        width="100%"
        height="10rem"
        mode="javascript"
        showGutter={false}
        theme="katzenmilch"
      />
    )
  }

  handleBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur(this.props.value)
    }
  }

}

export default CodeField
