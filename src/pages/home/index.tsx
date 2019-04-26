import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtAvatar, AtList, AtListItem, AtTag } from 'taro-ui'

import './index.scss'

type PageOwnProps = {}

type PageState = {}

class Home extends Component {
  config: Config = {
    navigationBarTitleText: '我的'
  }

  constructor() {
    super(...arguments)
    this.state = {
      profile: (() => {
        const user = Taro.getStorageSync('user')
        if (user) {
          return user.profile
        }
      })(),
      userRole: (() => {
        const user = Taro.getStorageSync('user')
        if (user) {
          return user.profile.role
        }
      })()
    }
  }

  navigateTo(page) {
    Taro.navigateTo({ url: page })
  }

  link() {
    Taro.makePhoneCall({
      phoneNumber: '18501765713'
    })
  }

  share() { }

  render() {
    return (
      <View className='home'>
        <View className="drawer-item user-info padding" style={{ padding: '24rpx' }}>
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <View style={{ 'margin-right': '24rpx' }}>
              <View>
                <AtAvatar circle size="large" openData={{ type: 'userAvatarUrl' }}></AtAvatar>
              </View>
            </View>
            <View>
              <View className="m-b-xs">
                {this.profile.name}
                {
                  this.state.userRole === 2 &&
                  <AtTag className='service-level-tag' size='small'>等级：{this.profile.service_level}</AtTag>
                }
              </View>
              <View >{this.profile.mobile}</View>
            </View>
          </View>
        </View>
        <View className="options">
          <AtList>
            <AtListItem
              className="menu-item"
              title='我的订单'
              arrow='right'
              iconInfo={{ value: 'shopping-bag' }}
              onClick={this.navigateTo.bind(this, '/pages/orders/list')}
            />
            {
              this.state.userRole === 1 &&
              <AtListItem
                className="menu-item"
                title='店铺管理'
                arrow='right'
                iconInfo={{ value: 'home' }}
                onClick={this.navigateTo.bind(this, '/pages/shop/index')}
              />
            }
            <AtListItem
              className="menu-item"
              title='钱包'
              arrow='right'
              iconInfo={{ value: 'credit-card' }}
              onClick={this.navigateTo.bind(this, '/pages/wallet/index')}
            />
            <AtListItem
              className="menu-item"
              title='客服'
              arrow='right'
              iconInfo={{ value: 'phone' }}
              onClick={this.link}
            />
            {/* <AtListItem
              className="menu-item"
              title='分享'
              arrow='right'
              iconInfo={{ value: 'share' }}
              onClick={this.share}
            /> */}
            <AtListItem
              className="menu-item"
              title='设置'
              arrow='right'
              iconInfo={{ value: 'settings' }}
              onClick={this.navigateTo.bind(this, '/pages/settings/index')}
            />
          </AtList>
        </View>
      </View>
    )
  }
}

export default Home as ComponentClass<PageOwnProps, PageState>
