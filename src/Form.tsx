import * as React from 'react'

interface FormContext {
  handleSubmit(e:React.FormEvent<HTMLElement>):void
} 

interface FieldContext {
  handleFocus():void
  handleBlur():void
  handleChange():void
  value:any
  checked:boolean
}

interface FieldProps<I,E> {
  validate(i:I, e:E) // when to validate? pass function to form and let form coordinate
  parse(i:I):E
  format(e:E):I
}

interface Props {
  onSubmit(data:{}):Promise<{}>
  initialValue?:{}
  render?(ctx:FormContext):JSX.Element
}

interface FieldData<T={}> {
  initialValue: T
  value: T
  touched: false
  dirty: false
  error?: string
  children: FieldData[] | {[fieldName: string]: FieldData}
}

interface State {
  /** Submit in progress */
  submitting: boolean
  /** Async validation in progress */
  validating: boolean
  fields: {[fieldName: string]: FieldData}
}

export default class Form extends React.Component<Props, State> {
  render() {
    return 
  }

  reset():void
}