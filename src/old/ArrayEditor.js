import React from 'react'
import {Connector} from './Context'

export default class ArrayEditor extends React.Component {
  render() {
    return <Connector
      path={this.props.path}
      render={({value, onChange, onFieldUpdate}) => <div>
        {value.map((element, index) => <div key={index}>
          {this.props.renderField(element, index)}
          <button onClick={() => {
            onChange(value.slice(0,index).concat(value.slice(index+1)))
            onFieldUpdate(index, field => undefined)
          }}>X</button>
        </div>)}
        <button onClick={() => onChange(value.concat(''))}>Add</button>
      </div>}
    />
  }
}