import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtButton, AtDivider, AtDrawer, AtIcon, Picker } from 'taro-ui'
import Home from '../home/index'
import request from '../../utils/request'
import { qsFromParams } from '../../utils/url'

import './index.scss'

type PageOwnProps = {}

type PageState = {}

class ServiceIndex extends Component {
  config: Config = {
    navigationBarTitleText: 'FIXIT'
  }

  constructor() {
    super(...arguments)
    this.state = {
      show: false,
      brands: [],
      brandChecked: {},
      categories: [],
      categoryChecked: {},
      models: [],
      modelChecked: '',
      sns: [],
      snChecked: ''
    }
  }

  componentDidMount() {
    this.fetchBrands()
  }

  showDrawer = () => {
    this.setState({
      show: true
    })
  }

  onClose = () => { }

  confirm = () => {
    const params = qsFromParams(
      {
        brand_id: this.state.brandChecked,
        category_id: this.state.categoryChecked,
        model: this.state.modelChecked,
        sn: this.state.snChecked
      }
    )
    Taro.navigateTo({ url: `/pages/product/list?${params}` })
  }

  fetchBrands() {
    request.get('/brand').then(data => {
      this.setState({ brands: data })
    })
  }

  fetchCategories(brand = null) {
    request.get(`/category?brand_id=${brand}`).then(data => {
      this.setState({ categories: data })
    })
  }

  fetchModels = (brand, category) => {
    request.get(`/product/model?brand_id=${brand}&category_id=${category}`).then(data => {
      this.setState({ models: data })
    })
  }

  fetchSns = (brand, category, model) => {
    request.get(`/product/sn?brand_id=${brand}&category_id=${category}&model=${model}`).then(data => {
      this.setState({ sns: data })
    })
  }

  scanCode = () => {
    Taro.scanCode({ onlyFromCamera: true, scanType: 'qrCode' }).then(res => {
      request.get(`/product?sn=${res.result}`).then(data => {
        if (data && data.length) {
          Taro.navigateTo({ url: `/pages/product/detail?id=${data[0].id}` })
        }
      }).catch(() => {
        Taro.showToast({ title: '没有找到设备', icon: 'none' })
      });
    });
  }

  onBrandChange = e => {
    const idx = e.detail.value
    const value = this.state.brands[idx] || {}
    this.setState({ brandChecked: { value: value.id, label: value.name }, categories: [], categoryChecked: {}, models: [], modelChecked: '', sns: [], snChecked: '' })
    if (value.id) {
      this.fetchCategories(value.id)
    }
  }

  onCategoryChange = e => {
    const value = this.state.categories[e.detail.value] || {}
    this.setState({ categoryChecked: { value: value.id, label: value.name }, models: [], modelChecked: '', sns: [], snChecked: '' })
    if (value.id) {
      this.fetchModels(this.state.brandChecked.value, value.id)
    }
  }

  onModelChange = e => {
    const value = this.state.models[e.detail.value]
    this.setState({ modelChecked: value, sns: [], snChecked: '' })
    if (value) {
      this.fetchSns(this.state.brandChecked.value, this.state.categoryChecked.value, value)
    }
  }

  onSnChange = e => {
    const value = this.state.sns[e.detail.value]
    this.setState({ snChecked: value })
  }

  render() {
    return (
      <View className='service-index'>
        <View className="main">
          <View className="header padding">
            <View className='at-row at-row__align--center at-row__justify--between'>
              <View className='at-col at-col-2'>
                <View className="avatar-wrapper" onClick={this.showDrawer}>
                  <AtAvatar
                    circle
                    size="small"
                    openData={{ type: 'userAvatarUrl' }}
                  >
                  </AtAvatar>
                </View>
              </View>
              <View className='at-col at-col text-center'>
                <Text className="text-md">请选择服务设备</Text>
              </View>
              <View className='at-col at-col-2'>
                <View className="text-center text-muted" onClick={this.scanCode}>
                  <AtIcon value='repeat-play'></AtIcon>
                  <View className="text-xs">扫码选择</View>
                </View>
              </View>
            </View>
          </View>
          <View className="body padding">
            <View className="section">
              <View>
                <Picker mode="selector" range={this.state.brands} rangeKey="name" onChange={this.onBrandChange}>
                  <View className="picker">
                    <View className="at-row at-row__justify--between">
                      <Text className="selection-title text-list-item">请选择品牌</Text>
                      <View className="text-muted">{this.state.brandChecked.label}</View>
                    </View>
                  </View>
                </Picker>
              </View>
              <AtDivider />
            </View>
            <View className="section">
              <View>
                <Picker mode="selector" range={this.state.categories} rangeKey="name" onChange={this.onCategoryChange}>
                  <View className="picker">
                    <View className="at-row at-row__justify--between">
                      <Text className="selection-title text-list-item">请选择分类</Text>
                      <View className="text-muted">{this.state.categoryChecked.label}</View>
                    </View>
                  </View>
                </Picker>
              </View>
              <AtDivider />
            </View>
            <View className="section">
              <View>
                <Picker mode="selector" range={this.state.models} onChange={this.onModelChange}>
                  <View className="picker">
                    <View className="at-row at-row__justify--between">
                      <Text className="selection-title text-list-item">请选择型号</Text>
                      <View className="text-muted">{this.state.modelChecked}</View>
                    </View>
                  </View>
                </Picker>
              </View>
              <AtDivider />
            </View>
            <View className="section">
              <View>
                <Picker mode="selector" range={this.state.sns} onChange={this.onSnChange}>
                  <View className="picker">
                    <View className="at-row at-row__justify--between">
                      <Text className="selection-title text-list-item">请选择序列号</Text>
                      <View className="text-muted">{this.state.snChecked}</View>
                    </View>
                  </View>
                </Picker>
              </View>
              <AtDivider />
            </View>
            <AtButton className="m-a" type="primary" onClick={this.confirm}>确认</AtButton>
          </View>
        </View>

        <AtDrawer
          show={this.state.show}
          mask
          onClose={this.onClose.bind(this)}
        >
          <Home></Home>
        </AtDrawer>
      </View>
    )
  }
}

export default ServiceIndex as ComponentClass<PageOwnProps, PageState>
