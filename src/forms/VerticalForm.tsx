import * as React from 'react'
import * as c from 'classnames'
import Button from './Button'
import * as styles from './form.less'

export interface FormProps {
  submitLabel: string
  cancelLabel?: string
  deleteLabel?: string
  disabled?: boolean
  submitting?: boolean
  onSubmit?(e:React.FormEvent<HTMLFormElement>):void
  onCancel?():void
  onDelete?():void
  className?: string
  readOnly?: boolean
  buttonClass?: string
}

const DefaultProps = {
  submitLabel: 'Create',
  cancelLabel: 'Cancel',
  disabled: false
}

export default class VerticalForm extends React.Component<FormProps> {
  static defaultProps = DefaultProps;

  render() {
    const {children, className, onCancel, cancelLabel, onDelete, deleteLabel, disabled, submitLabel, submitting, readOnly, buttonClass} = this.props
    return <form className={c(styles.form, className)} onSubmit={this.handleSubmit}>
      {children}
      { !readOnly && <fieldset className={styles.fieldset}>
        {onDelete && <Button className="qa-deleteButton" label={deleteLabel} onClick={this.handleDelete} type="danger"/>}
        {onCancel && <Button className="qa-cancelButton" label={cancelLabel} onClick={this.handleCancel} type="cancel"/>}
        <Button className={c("qa-submitButton", buttonClass)} type="submit" disabled={disabled} submitting={submitting} label={submitLabel}/>
      </fieldset> }
    </form>
  }

  handleSubmit = (e:React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (this.props.onSubmit) {
      this.props.onSubmit(e)
    }
  }

  handleCancel = (e:React.MouseEvent<HTMLButtonElement>):void => {
    e.preventDefault();
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  handleDelete = (e:React.MouseEvent<HTMLButtonElement>):void => {
    e.preventDefault();
    if (this.props.onDelete) {
      this.props.onDelete();
    }
  }
}
