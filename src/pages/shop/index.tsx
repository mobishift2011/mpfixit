import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtCard, AtList, AtListItem } from 'taro-ui'
import request from '../../utils/request'

import './index.scss'

type PageOwnProps = {}

type PageState = {}

class ShopIndex extends Component {
  config: Config = {
    navigationBarTitleText: '店铺管理',
  }

  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      showResult: false
    }
  }

  componentDidMount() {
    let params = this.$router.params;
    params.index = 1;
    this.fetchList(params);
  }

  fetchList = (params) => {
    request.get('/shop', { data: params }).then(data => {
      this.setState({ list: data, showResult: true })
    })
  }

  render() {
    return (
      <View className="shop-index">
        {
          this.state.showResult &&
          <View>
            {
              this.state.list.length ? (
                this.state.list.map((item, idx) => {
                  return <AtCard
                    className="m-y-sm"
                    extra={item.no}
                    title={item.name}
                    key={idx}
                  >
                    <View>
                      <AtList hasBorder={false}>
                        <AtListItem
                          title="地址"
                          note={item.address || '-'}
                          hasBorder={false}
                          iconInfo={{ value: 'home' }}
                        />
                        <AtListItem
                          title="联系人"
                          note={item.manager || '-'}
                          hasBorder={false}
                          iconInfo={{ value: 'user' }}
                        />
                        <AtListItem
                          title="电话"
                          note={`${item.mobile || ''} ${item.phone || ''}`}
                          hasBorder={false}
                          iconInfo={{ value: 'phone' }}
                        />
                        <AtListItem
                          title="邮箱"
                          note={item.email || '-'}
                          hasBorder={false}
                          iconInfo={{ value: 'mail' }}
                        />
                        <AtListItem
                          title="营业时间"
                          note={`${item.openedAt || ''}-${item.closedAt || ''}`}
                          hasBorder={false}
                          iconInfo={{ value: 'clock' }}
                        />
                      </AtList>
                    </View>
                  </AtCard>
                })
              ) : (
                  <View className="empty text-muted">
                    <View className="m-b">
                      <AtIcon value='shopping-bag' size='45'></AtIcon>
                    </View>
                    <Text className="_500">暂无店铺</Text>
                  </View>
                )
            }
          </View>
        }
      </View>
    )
  }
}

export default ShopIndex as ComponentClass<PageOwnProps, PageState>
