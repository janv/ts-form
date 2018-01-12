import React from 'react'
import _ from 'lodash'
import icepick from '../../util/icepick'
import {defaultMemoize} from 'reselect'


// Maintains record about errors
// Add errors through context.onError
class StateProvider extends React.Component {
  static childContextTypes = {
    onError: React.PropTypes.any,
    errors: React.PropTypes.any
  }

  state = {
    errors: {},
    fields: {}
  }
  
  static defaultProps = {
    onError: ()=>{},
    errors: {},
  }

  getChildContext(){
    return {
      onError: this.handleError,
      errors: this.combineErrors(this.state.errors, this.props.errors)
    }
  }

  combineErrors = defaultMemoize((ours, theirs) => Object.assign({}, theirs, ours)) 

  componentWillReceiveProps(props){
    if (props.value !== this.props.value) {
      this.setState({errors: {}})
    }
  }

  render(){
    return React.Children.count(this.props.children) === 1 ? 
      React.Children.only(this.props.children) :
      <div>{this.props.children}</div>
  }

  // TODO One Error is enough. One place for the validation. We just need a way to figure
  // out how to let that validation access the entire object. Also need to figure out async
  // validation

  handleError = (path, error) => {
    // A child component telling us about an error at a position, add it to the list
    if (error) {
      this.props.onError(path, error) // For error providers nested in error connectors
      this.setState(
        ({errors}) => ({errors: appendError(errors, error)}),
      ) 
    }

    function appendError(list, newError) {
      return icepick.updateIn(
        list,
        [path],
        (existing) => existing ? icepick.push(existing, newError) : [newError]
      )
    }
  }

  // Abstract way to update a field
  handleFieldUpdate = (path, update) => {
    this.props.onFieldUpdate(path, update)
    this.setState(
      ({fields}) => ({fields: icepick.updateIn(fields, [path], update)})
    )
  }
}


// 
class StateConnector extends React.Component {
  static contextTypes = {
    onError: React.PropTypes.any,
    errors: React.PropTypes.any
  }

  static defaultProps = {
    path: '',
    validate: () => null,
    render: () => null
  }

  constructor(props, context) {
    super()
    this.validate(props, context)
  }

  componentWillReceiveProps(props, context){
    if (props.value !== this.props.value) {
      this.validate(props, context)
    }
  }

  // Renders, exposing an onError prop. Call this prop with a path
  // That path will be appended to the path of the connector
  //
  // Example:
  //
  // <Connector path='datetime' render={(onError) => <div>
  //   <DateEditor onError={e => onError('date', e)}/>
  //   <TimeEditor onError={e => onError('time', e)}/>
  // </div>}/>
  //
  // This is an advanced usecase.
  //
  // TODO: should also expose an errors prop, so we can read out all the errors and display them
  // Also then we should not store errors in our own state but get them from above
  render(){
    return this.props.render({
      onError: this.handleError,
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      errors: this.getErrors(),  // Errors for THIS path
      childErrors: this.getChildErrors(), // Errors for THIS path and child paths
    })
  }

  // TODO validate so umbauen dass es mit onFieldUpdate funktioniert
  // Zugriff auf globale Objekte kann es vielleicht durch Closures geben
  // Dann werden wir vielleicht auch das Geraffel mit Errors/Childerrors los
  // Es gibt nur noch einen Error, und den kennen wir selbst,
  // Move Context und State back together
  validate(props, context){
    context.onError(
      props.path,
      props.validate(props.value, props.path)
    )
  }

  getErrors() {
    return this.context.errors[this.props.path] || []
  }

  getChildErrors() {
    return _(this.context.errors)
      .pickBy((errors, path) => _.startsWith(path, this.props.path))
      .mapKeys((errors, path) => _.trimStart(path.slice(this.props.path.length), '.'))
      .value()
  }

  combinePaths = (path) => [..._.toPath(this.props.path),..._.toPath(path)].join('.')

  handleError = (path, error) => {
    if (!error) return
    this.context.onError(this.combinePaths(path), error)
  }

  // handleFieldUpdate = (path, update) => {
    // this.context.onFieldUpdate( this.combinePaths(path), update) }

  handleBlur = () => {
    this.context.onFieldUpdate(this.props.path, field => ({...field, touched: true}))
  }

  handleChange = () => {
    this.context.onFieldUpdate(this.props.path, field => ({...field, dirty: true}))
  }
}

export {
  StateProvider as Provider,
  StateConnector as Connector
}
