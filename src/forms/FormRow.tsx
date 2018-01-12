import * as React   from 'react'
import * as c       from 'classnames'
import * as form    from '../forms/form.less'

interface FormRowProps {
  centered?:  boolean
  className?: string
}

class FormRow extends React.Component<FormRowProps> {

  render() {
    const { centered, children, className } = this.props
    return (
      <div className={c(form.row, className, {[form.rowCentered]: centered})}>
        {this.props.children}
      </div>
    )
  }
}

export default FormRow