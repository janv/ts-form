import * as React   from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import * as c       from 'classnames'
import FormRow       from '../forms/FormRow'
import InputWrapper from '../forms/InputWrapper'
import Button from '../forms/Button'
import Icon from '../Icon'
import * as form    from '../forms/form.less'
import * as list from '../forms/DynamicList.less'
import * as styles from '../forms/DynamicList.less'

import {InputProps, WrappedInputProps, FieldProps, FieldRenderProps, makeConcreteField, FieldArrayProps, FieldArrayRenderProps, makeConcreteFieldArray, FieldComponent} from './FieldTypes'

/** Props that the DynamicListField has that do not come from the DynamicListInput */
interface CustomListFieldProps<FieldValue> {
  fieldComponent: FieldComponent<FieldValue>
  defaultValue: FieldValue
}

type DynamicListFieldProps<FieldValue> = FieldArrayProps<
  FieldValue,
  DynamicListInputProps & CustomListFieldProps<FieldValue>
>

class DynamicListField<FieldValue = any> extends React.Component<ObjectOmit<DynamicListFieldProps<FieldValue>, 'component'>> {
  /**
   * Use this to cast DynamicListField to a refined version inside a render function.
   *
   * Necessary until Typescript properly supports Generics in classes/JSX
   */
  static of<T>(): new() => DynamicListField<T> {
    return DynamicListField as any
  }

  render() {
    const FieldArray = makeConcreteFieldArray<FieldValue, DynamicListInputProps & CustomListFieldProps<FieldValue>>()
    return (
      <FieldArray
        component={this.renderComponent}
        defaultValue={this.props.defaultValue}
        disabled={this.props.disabled}
        fieldComponent={this.props.fieldComponent}
        fullWidth={this.props.fullWidth}
        itemClassName={this.props.itemClassName}
        name={this.props.name}
        showAdd={this.props.showAdd}
      />
    )
  }

  renderComponent(props: FieldArrayRenderProps<DynamicListInputProps & CustomListFieldProps<FieldValue>>) {
    const fieldComponentWithKey:FieldComponent<FieldValue> = (field, index, fields) => {
      const fieldElement =  props.fieldComponent(field, index, fields)
      if ('key' in fieldElement.props) {
        return fieldElement
      } else {
        return React.cloneElement(fieldElement, {key: index})
      }
    }

    return (
      <DynamicListInput
        disabled={props.disabled}
        fullWidth={props.fullWidth}
        itemClassName={props.itemClassName}
        showAdd={props.showAdd}
        remove={props.fields.remove}
        addNew={() => props.fields.push(props.defaultValue)}
      >
        {props.fields.map(fieldComponentWithKey)}
      </DynamicListInput>
    )
  }
}

interface DynamicListInputProps {
  addLabel?:      string
  allowEmpty?:    boolean
  disabled?:      boolean
  fullWidth?:     boolean
  itemClassName?: string
  readOnly?:      boolean
  showAdd?:       boolean
  separator?:     React.ReactNode

  remove?(i: number):void
  addNew?():void
}

export class DynamicListInput extends React.Component<DynamicListInputProps> {
  static defaultProps = { showAdd: true }

  render() {
    const transitionConfig = {
      transitionName: 'slide',
      transitionAppear: false,
      transitionLeave: false,
      transitionEnter: true,
      transitionEnterTimeout: 600
    }

    return (
      <CSSTransitionGroup {...transitionConfig} className={c(form.form, form.block, {[form.full]: this.props.fullWidth})}>
        { this.mappedChildren() }
        { this.renderAdd() }
      </CSSTransitionGroup>
    )
  }

  mappedChildren = () => {
    const {children, itemClassName, readOnly, allowEmpty} = this.props
    return React.Children.map(children, (child, i) => {
      return <FormRow key={i} className={c(form.row, styles.item, itemClassName, 'qa-dynamicListItem')}>
        {child}
        {this.renderRemove(i)}
      </FormRow>
    })
  }

  renderRemove = (index:number) => {
    const singleChild = React.Children.count(this.props.children) <= 1
    const {allowEmpty, disabled, readOnly} = this.props
    return !readOnly && !disabled && (!singleChild || allowEmpty) && (
      <span className={form.inlineRemove}>
        <Icon name="minus-circle" onClick={() => this.handleClickRemove(index)}/>
      </span>
    )
  }

  handleClickRemove = (index:number) => {
    if (this.props.remove) {
      this.props.remove(index)
    }
  }

  renderAdd = () => {
    const {addLabel, showAdd, disabled, readOnly} = this.props
    return showAdd && (
      <FormRow centered>
        <Button
          secondary
          label={addLabel || 'Add'}
          className = "qa-addListItem"
          iconName="plus"
          onClick={this.handleClickAdd}
          disabled={readOnly || disabled}
        />
      </FormRow>
    )
  }

  handleClickAdd = () => {
    if(this.props.addNew) {
      this.props.addNew()
    }
  }
}

export default DynamicListField
