import * as React  from 'react'
import * as styles from './form.less'
import * as c      from 'classnames'

type InfoGroupProps = {
  className?: string,
  label: string,
  value: React.ReactChild
}

export default class InfoGroup extends React.Component<InfoGroupProps> {
  render() {
    return <div className={c(this.props.className, styles.group)}>
      <label className={styles.label}>{this.props.label}</label>
      <div className={c('qa-infoGroupBody', styles.labeledContent)}>
        {this.props.value}
      </div>
    </div>
  }
}
