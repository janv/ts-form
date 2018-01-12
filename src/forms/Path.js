import React from 'react'
import _ from 'lodash'
import icepick from '../../util/icepick'
import Transformer from './Transformer'

export default class Path extends React.Component {
  static defaultProps = {
    // value
    path: ''
  }

  render(){
    return <Transformer
      format={this.format}
      parse={this.parse}
      render={this.props.render}
    />
  }

  format = (modelValue) => {
    return _.get(this.props.value, this.props.path)
  }

  parse = (viewValue) => {
    return icepick.setIn(
      this.props.value,
      _.toPath(this.props.path),
      viewValue)  }
}
