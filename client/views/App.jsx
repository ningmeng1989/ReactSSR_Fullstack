/**
 * Created by JianBo.Wang on 2018/11/9.
 */
import React from 'react'
import {
  Link,
} from 'react-router-dom'
import Routes from '../config/router'

export default class App extends React.Component {
  componentDidMount() {
    // Do something
  }

  render() {
    return [
      <div key="banner">
        <Link to="/">首页</Link>
        <br />
        <Link to="/detail">详情页</Link>
        <br />
        <Link to="/test">测试页</Link>
      </div>,
      <Routes key="routes" />,
    ]
  }
}
