import * as React from 'react'
import * as PropTypes from 'prop-types'
import {updateIn} from 'lodash/fp'

export interface RenderProps {
  onSubmit():void
  onReset():void
}

export interface Props {
  onChange?(value:any):void
  value?: any
  render(renderProps:RenderProps):JSX.Element
  onFieldUpdate(path:string, update:()=>any):void
}

export interface State {
  fields: {[fieldName: string]: any}
}

class ContextProvider extends React.Component<Props, State> {
  static childContextTypes = {
    value: PropTypes.any,
    onChange: PropTypes.any,
    onFieldUpdate: PropTypes.any,
    fields: PropTypes.any
  }

  state = {
    fields: {}
  }

  getChildContext(){
    return {
      value: this.props.value,
      onChange: this.handleChange,
      onFieldUpdate: this.handleFieldUpdate,
      fields: this.state.fields
    }
  }

  render(){
    return this.props.render({
      onSubmit: this.handleSubmit,
      onReset: this.handleReset,
    })
  }

  handleSubmit = () => {}

  handleReset = () => {
    this.setState({fields: {}})
  }

  handleChange = (value:any) => {
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  handleFieldUpdate = (path:string, update:()=>any) => {
    this.props.onFieldUpdate(path, update)
    this.setState(
      ({fields}) => ({fields: icepick.updateIn(fields, [path], update)})
    )
  }

}


class ContextConnector extends React.Component {
  static contextTypes = {
    value: React.PropTypes.any,
    onChange: React.PropTypes.any,
    onFieldUpdate: React.PropTypes.any,
    fields: React.PropTypes.any,
  }

  static propTypes = {
    path: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    render: React.PropTypes.func
  }

  static defaultProps = {
    path: '',
    render: () => null
  }

  emptyField = {}

  componentWillMount(){
    this.validate(this.props, this.context)
  }

  componentWillReceiveProps(props, context){
    if (this.getValue(props, context) !== this.getValue(this.props, this.context)){
      this.validate(props, context)
    }
  }

  render(){
    return this.props.render({
      value: this.getValue(this.props, this.context),
      field: this.getField(this.props, this.context),

      onChange: this.handleChange,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,

      onFieldUpdate: this.handleFieldUpdate,
    })
  }

  getValue(props, context){
    return _.get(context.value, props.path)
  }

  getField(props, context){
    return context.fields[props.path] || this.emptyField
  }

  handleChange = (value) => {
    this.context.onFieldUpdate(this.props.path, field => ({...field, dirty: true}))
    this.context.onChange(icepick.setIn(
      this.context.value,
      _.toPath(this.props.path),
      value))
  }

  handleFieldUpdate = (path, update) => {
    this.context.onFieldUpdate(this.combinePaths(path), update)
  }

  handleFocus = () => {
    this.context.onFieldUpdate(this.props.path, field => ({...field, focus: true}))
  }

  handleBlur = () => {
    this.context.onFieldUpdate(this.props.path, field => ({...field, touched: true, focus: false}))
  }

  validate(props, context) {
    if (!props.validate) return
    const error = props.validate(this.getValue(props, context), context.value)
   
    if (error !== this.getField(props, context).error) {
      context.onFieldUpdate(props.path, field => ({ ...field, error }))
    }
  }

  combinePaths(path) {
    return [ ..._.toPath(this.props.path), ..._.toPath(path) ].join('.')
  }
}

export {
  ContextProvider as Provider,
  ContextConnector as Connector
}
