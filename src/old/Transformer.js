/* @noflow */
import React from 'react'

export default class Transformer extends React.Component {
  static defaultProps = {
    format: x => x,
    parse: x => x,
    render: () => null,
    onChange: () => {},
    onParseError: () => {},
  }

  state = {
    viewValue: undefined,
    parseError: undefined
  }

  constructor(props){
    super()
    this.state.viewValue = props.format(props.value)
  }

  componentWillReceiveProps(props){
    if (props.value !== this.props.value || props.format !== this.props.format) {
      this.setState({ viewValue: props.format(props.value) })
    }
  }

  render(){
    return this.props.render({
      value: this.state.viewValue,
      onChange: this.handleChange,
      parseError: this.state.parseError
    })
  }

  handleChange = (viewValue) => {
    this.setState({viewValue, parseError: undefined})
    let modelValue
    try {
      modelValue = this.props.parse(viewValue)
    } catch (parseError) {
      this.setState({parseError})
      this.props.onParseError(parseError)
      return
    }
    this.props.onChange(modelValue)
  }
}
