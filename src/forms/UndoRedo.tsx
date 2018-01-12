import * as React from 'react'
import * as c     from 'classnames'
import Icon from '../Icon'
import * as styles   from './UndoRedo.less'

interface UndoRedoProps {
  disabled?: boolean
  canUndo?: boolean
  canRedo?: boolean
  onUndo?():void
  onRedo?():void
  registerKeyboardEvents?: boolean
}

export default class UndoRedo extends React.Component<UndoRedoProps> {
  render() {
    const { disabled } = this.props
    const buttonClass = c(styles.button, { [styles.disabled]: disabled })
    const containerClass = c( styles.undoRedo, { [styles.disabled]: disabled })

    return <div className={containerClass}>
      <button
        disabled={!this.props.canUndo}
        onClick={this.props.onUndo}
        type="button"
        className={buttonClass}>
          <Icon name="undo" tooltip="Undo" />
      </button>
      <button
        disabled={!this.props.canRedo}
        onClick={this.props.onRedo}
        type="button"
        className={buttonClass}>
          <Icon name="repeat" tooltip="Redo" />
      </button>
    </div>
  }

  componentDidMount() {
    if(this.props.registerKeyboardEvents) {
      window.document.addEventListener('keydown', this.handleEvent)
    }
  }

  componentWillUnmount() {
    if(this.props.registerKeyboardEvents) {
      window.document.removeEventListener('keydown', this.handleEvent)
    }
  }

  handleEvent = (event: KeyboardEvent) => {
    if (!event.metaKey && !event.ctrlKey)
      return

    switch (event.key) {
      case 'z':
        event.preventDefault()
        this.props.canUndo && this.props.onUndo && this.props.onUndo()
        break
      case 'y':
        event.preventDefault()
        this.props.canRedo && this.props.onRedo && this.props.onRedo()
        break
      default:
        return
    }
  }
}
