import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIndexes } from "taro-ui"
import request from '../../utils/request'

import './list.scss'

type PageOwnProps = {}

type PageState = {}

class ProductList extends Component {
  config: Config = {
    navigationBarTitleText: '设备列表',
    disableScroll: false,
  }

  constructor() {
    super(...arguments)
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    let params = this.$router.params
    params.index = 1
    request.get('/product', { data: params }).then(data => {
      this.setState({ list: data })
    })
  }

  selectProduct(item) {
    Taro.navigateTo({ url: `/pages/product/detail?id=${item.id}` })
  }

  render() {
    return (
      <View className="product-list">
        <View className="list-wrapper">
          <AtIndexes
            list={list}
            animation={true}
            isVibrate={false}
            isShowToast={false}
            topKey=""
            onClick={this.selectProduct.bind(this)}
          >
            {/* <View class="padding text-center">也许可以放点设备广告</View> */}
          </AtIndexes>
        </View>
      </View>
    )
  }
}

export default ProductList as ComponentClass<PageOwnProps, PageState>
