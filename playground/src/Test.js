import React from 'react'
import {Form, FormField} from '../components/forms/Form'
import ArrayEditor from '../components/forms/ArrayEditor'
import {TypedSelectTwo} from '../components/forms/TypedSelect'
import DateTimeEditor from '../components/forms/DateTimeEditor'
import _ from 'lodash'



const Test = <Form
  onSubmit={data => doStuff(data)}
  render={(ctx) => <form onSubmit={ctx.handleSubmit}>
    <Field
    ctx={ctx}
    render={fieldCtx => <input onChange={fieldCtx.handleChange} /* handleBlur, handleFocus, value *//>}
    />}>
  </form>}/>


export default class Test extends React.Component {
  state = { model: {
    datum: new Date(),
    foo: { bar: 'baz' },
    herps: ['herp1', 'herp2']
  }}

  render(){
    return <div>
      Hi
      FormRender: <pre>{JSON.stringify(this.state.model, null, '  ')}</pre>

      <Form value={this.state.model} onChange={v => this.setState({model: v})}>
          <FormField render={
            ({value, onChange})=>
            <button onClick={() => onChange('xxx')}>Change</button>}
          />
          <FormField
            path="foo.bar"
            format={x => x == null ? '': x}
            parse={x => x == '' ? null : x.trimLeft()}
            render={({onChange, value}) => <input
              onChange={e=>onChange(e.target.value)}
              value={value}/>}
          />
          <FormField
            path="foo.bar"
            format={x => x == null ? '': x}
            parse={x => x == '' ? null : x.trimRight()}
            render={({onChange, value}) => <input
              onChange={e=>onChange(e.target.value)}
              value={value}/>}
          />
          <FormField
            path="foo"
            parse={x => x.bang ? x : _.omit(x, 'bang')}
            render={() => 
              <TypedSelectTwo
                path="bang"
                options={[['(none)', null], ['Foo', 'foo'], ['Bar', 'bar'], ['Baz', 'baz']]}
              />
            }
          />
          <FormField
            path={'herps'}
            validate={(value) => {
              console.log('validating herps array', value);
              return value && value.length < 2 && 'Too short' || undefined
            }}
            render={({childErrors})=> <FormField
              path={'herps.0'}
              render={({errors, field})=><span>
                Field:{JSON.stringify(field)}<br/>
                </span>}
              validate={(str) => {
                console.log('validating first value', str);
                return str && str.length < 3 && 'Too short' || undefined
              }}
            />}
          />
          <ArrayEditor
            path="herps"
            renderField={(value, index) => <FormField
                key={index}
                path={'herps.'+index}
                render={({onChange, onFocus, onBlur, value}) => <div>Index {index}: <input
                  onChange={e=>onChange(e.target.value)}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  value={value}/>
                  </div>}
                />}
            />
          <DateTimeEditor
            path="datum"
          />
      </Form>
    </div>
  }
}
