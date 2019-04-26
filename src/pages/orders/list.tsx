import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtCard, AtList, AtListItem, AtLoadMore } from "taro-ui"
import request from '../../utils/request'

import './list.scss'

type PageOwnProps = {}

type PageState = {}

class OrderList extends Component {
  config: Config = {
    navigationBarTitleText: '我的订单',
    disableScroll: false,
  }

  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      more: 'more',
      categoryOptions: {
        'maintenance': '保养'
      },
      stateOptions: {
        1: '派单中',
        2: '待上门',
        3: '服务中',
        4: '待确认',
        5: '已完成'
      }
    }
  }

  componentDidMount() {
    request.get(`/order`).then(data => {
      this.setState({ list: data });
    })
  }

  fetchList() {
    this.setState({
      more: 'loading'
    })
    let list = this.state.list;
    list.push.apply(list, list);
    this.setState({
      list: list,
      // more: 'noMore'
    })
  }

  navigateToDetail(pk) {
    Taro.navigateTo({ url: `/pages/orders/detail?id=${pk}` })
  }

  render() {
    return (
      <View className="order-list p-y">
        {
          this.state.list.map((item, idx) => {
            return <AtCard
              className="m-b-sm"
              note={`技师 ${item.service_user && item.service_user.name || '待指派'}`}
              extra={`${this.state.stateOptions[item.state]} ›`}
              title={`${this.state.categoryOptions[item.category]} ${item.no}`}
              key={idx}
              onClick={this.navigateToDetail.bind(this, item.id)}
            >
              <View>
                <AtList hasBorder={false}>
                  <AtListItem
                    title={item.appointed_at && item.appointed_at.substring(0, 16)}
                    extraText={`￥${item.price}`}
                    hasBorder={false}
                    iconInfo={{ value: 'clock' }}
                  />
                  <AtListItem
                    title={item.shop_name}
                    note={item.shop_address}
                    hasBorder={false}
                    iconInfo={{ value: 'home' }}
                  />
                  <AtListItem
                    title={`${item.product_brand || ''} ${item.product_name} ${item.product_model || ''}`}
                    note={item.product_sn}
                    hasBorder={false}
                    iconInfo={{ value: 'iphone' }}
                  />
                </AtList>
              </View>
            </AtCard>
          })
        }
        {/* <AtLoadMore
          onClick={this.fetchList.bind(this)}
          status={this.state.more}
          moreText='点击查看更多'
          noMoreText='已经到底啦~'
        /> */}
      </View>
    )
  }
}

export default OrderList as ComponentClass<PageOwnProps, PageState>
