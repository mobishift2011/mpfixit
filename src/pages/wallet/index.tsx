import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'

import './index.scss'

type PageOwnProps = {}

type PageState = {}

class Wallet extends Component {
  config: Config = {
    navigationBarTitleText: '我的余额',
  }

  constructor() {
    super(...arguments)
    this.state = {}
  }

  componentDidMount() { }

  render() {
    return (
      <View className="wallet">
        <View className="card p-a">
          <View className="title m-b-sm">余额（元）</View>
          <View className="amount">
            <Text>0.00</Text>
          </View>
        </View>
        <View className="details">
          <View className="empty p-a text-center">
            <View className="icon p-a-sm m-a-sm">
              <AtIcon className="text-muted" value='tags' size='45'></AtIcon>
            </View>
            <View className="p-b-lg">
              <Text className="tip text-sm _500">暂无余额明细</Text>
            </View>
          </View>
        </View>
        <View className="bottom-bar p-a-sm">
          <AtButton type="primary" disabled={true}>提现</AtButton>
        </View>
      </View>
    )
  }
}

export default Wallet as ComponentClass<PageOwnProps, PageState>
