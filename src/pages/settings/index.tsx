import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'

import './index.scss'

type PageOwnProps = {}

type PageState = {}

class settings extends Component {
  config: Config = {
    navigationBarTitleText: '设置'
  }

  constructor() {
    super(...arguments)
    this.state = {}
  }

  componentDidMount() { }

  signOut() {
    Taro.removeStorageSync('user')
    Taro.reLaunch({ url: '/pages/signin/signin' })
  }

  render() {
    return (
      <View className="settings">
        <View className="p-a">
          <AtButton type="primary" onClick={this.signOut}>退出登录</AtButton>
        </View>
      </View>
    )
  }
}

export default settings as ComponentClass<PageOwnProps, PageState>
