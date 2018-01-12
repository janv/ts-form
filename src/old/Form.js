import React from 'react'
import _ from 'lodash'
import icepick from '../../util/icepick'
import * as Context from './Context'
import Transformer from './Transformer'

export class Form extends React.Component {
  static defaultProps = {
    onChange: x => {console.log('Changed', x)},
    onError: x => {console.log('Error', x)}
  }

  state = {
    errors: {}
  }

  render(){
    return <Context.Provider value={this.props.value} onChange={this.props.onChange}>
      {this.props.children}
    </Context.Provider>
  }

}

export class FormField extends React.Component {
  static defaultProps = {
    format: x => x,
    parse: x => x,
    path: '',
    render: () => null
  }

  render(){
    return <Context.Connector
      path={this.props.path}
      validate={this.props.validate}
      render={({value: contextValue, onChange:contextOnChange, onBlur, onFocus, onFieldUpdate, field}) =>
        <Transformer
          value={contextValue}
          onChange={contextOnChange}
          format={this.props.format}
          parse={this.props.parse}
          render={({value, onChange}) => 
              this.props.render({value, onChange, onBlur, onFocus, field})
          }
        />
      }
    />

  }
  
}

export function makeField(config = {}){
  return function decorator(Component) {
    return class FieldWrapper extends Component {
      static displayName = `Field(${getDisplayName(Component)})`;
      static WrappedComponent = Component

      static defaultProps = {}

      constructor(props) {
        super()
        this.fieldProps = this.getFieldProps(props)
      }

      componentWillReceiveProps(nextProps){
        this.fieldProps = this.getFieldProps(nextProps)
      }

      render(): React.Element {
        return <SubField {...this.fieldProps} render={this.renderComponent} />
      }

      renderComponent = (renderProps) => {
        return <Component {...this.props} {...renderProps}/>
      }

      getFieldProps(props) {
        // todo this function should not recalculate on every
        // render but cache its return value
        return _.reduce(['onChange', 'path', 'render'],
          (fieldProps, prop) => ({...fieldProps, [prop]: props[prop] || config[prop]}),
          {})
      }
      
    }
  }
}

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}
