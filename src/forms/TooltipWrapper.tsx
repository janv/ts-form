import * as React from 'react'
import Tooltip    from 'rc-tooltip'
import * as c from 'classnames'
import * as styles from './Tooltip.less'
import Icon from '../Icon'

interface Props {
  className?: string
  children?: React.ReactNode
  tooltip: React.ReactChild
}

export default function TooltipWrapper({children, tooltip, className}:Props) {
  // Tooltip doesn't accept cutomElements and we need to wrap it in
  // a DOM element: issue react-component/tooltip#51
  return <div className={c(className, styles.inputTooltipWrapper)}>
    {children}
    <Tooltip placement="right" trigger={['hover']} overlay={tooltip}>
      <span className={styles.tooltipIcon}>
        <Icon name="question-circle" />
      </span>
    </Tooltip>
  </div>
}
