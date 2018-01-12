import * as React from 'react'
import * as c from 'classnames'
import * as styles from './form.less'
import Icon from '../Icon'
import TooltipWrapper from './TooltipWrapper'

export interface InputWrapperProps {
  checkboxLabel?:string
  className?:string
  hint?:React.ReactFragment
  /** Whether to render the asterisk after the label */
  required?: boolean
  /** Whether to push the label down into the component */
  pushLabelDown?: boolean
  
  /** If true, prevents the label from being rendered at all, default false */
  hideLabel?:boolean

  label?:React.ReactFragment
  tooltip?: React.ReactChild

  /** An error to be rendered */
  error?:React.ReactNode
}

export default class InputWrapper extends React.Component<InputWrapperProps> {
  render() {
    const { checkboxLabel, className, hint, error, hideLabel, label, tooltip, required, pushLabelDown} = this.props
    const labelClass = c(
      styles.label,
      {
        [styles.required]: required,
        [styles.pushLabelDown]: pushLabelDown
      }
    )

    return <div className={c(styles.group, className)}>
      { hideLabel ? null : <label className={labelClass}>{label}</label> }
      { 
        tooltipWrapper(
          checkboxWrapper(
            this.props.children,
            checkboxLabel),
          tooltip)
      }
      { hint && <div className={styles.hint}>{hint}</div> }
      { error && <div className={styles.error}>{error}</div> }
    </div>
  }
}

function tooltipWrapper(children:React.ReactNode, tooltip?:React.ReactChild):React.ReactNode {
  if (!tooltip) return children
  return <TooltipWrapper tooltip={tooltip}>{children}</TooltipWrapper>
}

function checkboxWrapper(children:React.ReactNode, label?:string):React.ReactNode {
  if (!label) return children
  return <label className={c(styles.col, styles.inputLabel)}>{children} {label}</label>
}