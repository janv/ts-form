import * as React from 'react'
import * as c     from 'classnames'
import { Link } from 'react-router'
import Icon     from '../Icon' 
import * as styles   from './Button.less'

interface ButtonProps {
  className?: string,
  disabled?: boolean,
  iconName?: string,
  label?: string,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  secondary?: boolean,
  to?: string | {
    pathname: string,
    query: Object
  },
  submitting?: boolean,
  type?: 'cancel' | 'danger' | 'icon' | 'submit'
}

export default class Button extends React.Component<ButtonProps> {

  render() {
    const {className, disabled, iconName, label, to, onClick, secondary, submitting, type} = this.props
    const cName = c(styles.button, {
      [styles.secondaryButton]: secondary,
      [styles.submitting]: submitting,
      [styles.disabled]: disabled,
      [styles.iconButton]: type === 'icon',
      [styles.dangerButton]: type === 'danger',
      [styles.cancelButton]: type === 'cancel'
    }, className)

    if(to) {
      return disabled
        ? <button className={cName}>{label}</button>
        : <Link to={to} className={cName}>{label}</Link>
    } else if(type === 'submit') {
      return <button type="submit" className={cName} disabled={disabled || submitting}>
        {submitting ? 'Submitting...' : label}
      </button>

    } else {
      return <button type="button" className={cName} disabled={disabled} onClick={onClick}>
        {iconName && <Icon name={iconName}/>}
        {label}
      </button>
    }
  }
}
