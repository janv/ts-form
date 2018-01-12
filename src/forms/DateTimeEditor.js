/* @noflow */
import React from 'react'
import {FormField} from './Form'
import {TypedSelectTwo} from './TypedSelect'
import moment from 'moment'
import _ from 'lodash'
import DatepickerComponent from './Datepicker'

export default class DateTimeEditor extends React.Component {
  render() {
    return <FormField
      path={this.props.path}
      format={this.format}
      parse={this.parse}
      render={(field)=><div>
        <pre>{JSON.stringify(field.value, null, '  ')}</pre>
        <Datepicker path='date'/>
        <TZSelect path='zone'/>
      </div>}
    />
  }
        //<TimeInput path='time'/>

  format(str){
    const m = moment.parseZone(str)
    return {
      date: m.format('YYYY-MM-DD'),
      time: m.format('HH:mm'),
      zone: m.format('Z')
    }
  }

  parse({date, time, zone}){
    const m = moment(`${date}T${time}${zone}`)
    console.log('toIso',`${date}T${time}${zone}`, m.toISOString());
    return m.toISOString()
  }
}

class Datepicker extends React.Component {
  render(){
    return <FormField
      path={this.props.path}
      format={dateString=>moment(dateString).valueOf()}
      parse={unixtime=>unixtime ? moment(parseInt(unixtime)).format('YYYY-MM-DD') : null}
      render={field => <DatepickerComponent
        onChange={field.onChange}
        onBlur={this.handleBlur}
        value={field.value}
      />}
    />
  }

  handleBlur(){

  }
}

class TimeInput extends React.Component {
  render(){

  }
}

class TZSelect extends React.Component {
  static Zones = _.times(24, t => [`+${t<10?0:''}${t}:00`, `+${t<10?0:''}${t}:00`])
  render() {
    return <TypedSelectTwo
      path={this.props.path}
      options={TZSelect.Zones}
    />
  }
}
