import * as React from 'react'
import * as c from 'classnames'
import Icon from '../Icon'

import * as style  from './SearchBar.less'
import * as form   from './form.less'

interface SearchBarProps {
  autoFocus?: boolean
  className?: string
  defaultValue?: string
  placeholder?: string
  onChange?(searchTerm:string):void
  value?: string
  inputClassName?: string
}

interface SearchBarState {
  searchTerm: string
}

class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  state = {searchTerm: ''}

  componentDidMount(){
    const {defaultValue} = this.props

    if (defaultValue) {
      this.setSearchTerm(defaultValue)
    }
  }

  componentWillReceiveProps(nextProps: SearchBarProps) {
    if(nextProps.value !== this.props.value) {
      this.setSearchTerm(nextProps.value || '')
    }
  }

  render() {
      const {autoFocus, className, placeholder, inputClassName} = this.props
      const {searchTerm} = this.state

      return <div className={c(className, style.searchContainer)}>
          <input type="search" autoComplete="off" placeholder={placeholder} value={searchTerm}
            className={c(form.input, style.search, inputClassName)} onChange={this.changeHandler} autoFocus={autoFocus}/>
          <Icon name="search" className={style.searchIcon}/>
          {searchTerm && <Icon name="remove close" className={style.clearIcon} onClick={this.clearValue}/>}
        </div>
    }

    clearValue = (): void => {
      this.setSearchTerm('')
    }

    changeHandler = (e: React.FormEvent<HTMLInputElement>) => {
      this.setSearchTerm(e.currentTarget.value)
    }

    setSearchTerm(searchTerm: string) {
      const { onChange } = this.props

      this.setState({
        searchTerm: searchTerm
      })

      if (onChange) onChange(searchTerm)
    }
}

export default SearchBar
