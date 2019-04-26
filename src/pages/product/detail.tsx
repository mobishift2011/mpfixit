import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem, AtImagePicker, AtButton } from "taro-ui"
import request from '../../utils/request'

import './detail.scss'

type PageOwnProps = {}

type PageState = {}

class ProductDetail extends Component {
  config: Config = {
    navigationBarTitleText: '设备详情',
    disableScroll: false,
  }

  constructor() {
    super(...arguments)
    this.state = {
      product: {}
    }
  }

  componentDidMount() {
    this.fetchDetail();
  }

  fetchDetail = () => {
    const pk = this.$router.params.id;
    request.get(`/product/${pk}`).then(data => {
      this.setState({ product: data });
    })
  }

  appointService = () => {
    Taro.setStorageSync('ordered-product', this.state.product)
    Taro.navigateTo({ url: `/pages/orders/form` })
  }

  viewLogs = () => {
    Taro.showToast({ title: '暂无历史记录', icon: 'none' })
  }

  render() {
    return (
      <View className="product-detail">
        <View className="product-info">
          <AtList className="m-b-sm" hasBorder={false}>
            <AtListItem title="名称" extraText={product.name} />
            <AtListItem title="品牌" extraText={product.brand && product.brand.name} />
            <AtListItem title="分类" extraText={product.category && product.category.name} />
            <AtListItem title="型号" extraText={product.model} />
            <AtListItem title="规格" extraText={product.specification} />
            <AtListItem title="序列号" extraText={product.sn} />
            <AtListItem title="安装日期" extraText={product.installed_at} />
            <AtListItem title="维修过保" hasBorder={false} extraText={product.warranty_repair_at} />
            <AtListItem title="保养过保" hasBorder={false} extraText={product.warranty_maintenance_at} />
          </AtList>
          <AtList className="m-b-sm" hasBorder={false}>
            <AtListItem title="制造商" extraText={product.manufacturer} />
            <AtListItem title="供应商" hasBorder={false} extraText={product.supplier} />
          </AtList>
        </View>
        <View className="product-images">
          <AtImagePicker
            length={3}
            files={this.state.product.images}
            showAddBtn={false}
          />
        </View>
        <View className="btn-groups p-y p-x-md">
          <AtButton type="primary" className="m-b-sm" onClick={this.appointService}>预约服务</AtButton>
          <AtButton type="primary" onClick={this.viewLogs}>查看历史记录</AtButton>
        </View>
      </View>
    )
  }
}

export default ProductDetail as ComponentClass<PageOwnProps, PageState>
