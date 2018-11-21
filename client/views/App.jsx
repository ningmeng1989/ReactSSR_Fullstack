/**
 * Created by JianBo.Wang on 2018/11/9.
 */
import React from 'react'
// import {
//   Link,
// } from 'react-router-dom'
import Routes from '../config/router'

import AppBar from './layout/AppBar'

export default class App extends React.Component {
  componentDidMount() {
    // Do something
  }

  render() {
    return [
      <AppBar key="appbar" />,
      <Routes key="routes" />,
    ]
  }
}
