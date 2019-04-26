import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtList, AtListItem, AtButton } from "taro-ui"
import request from '../../utils/request'

import './form.scss'

type PageOwnProps = {}

type PageState = {}

class OrderForm extends Component {
  config: Config = {
    navigationBarTitleText: '下单',
    disableScroll: false,
  }

  constructor() {
    super(...arguments)
    this.state = {
      loadings: {
        submit: false
      },
      product: {},
      form: {
        category: 'maintenance',
        appointed_at: null
      },
      categoryOpt: {
        'maintenance': '保养'
      },
      appointed_date: '',
      appointed_time: ''
    }
  }

  componentDidMount() {
    const product = Taro.getStorageSync('ordered-product')
    const form = this.state.form
    form.product = product.id
    this.setState({ product: product, form: form })
  }

  setAppointedAt = (date, time) => {
    const form = this.state.form
    form.appointed_at = (date && time) ? `${date} ${time}` : null
    this.setState({ form: form })
  }

  onDateChange = e => {
    const val = e.detail.value
    this.setState({
      appointed_date: val
    })
    this.setAppointedAt(val, this.state.appointed_time)
  }

  onTimeChange = e => {
    const val = e.detail.value
    this.setState({
      appointed_time: val
    })
    this.setAppointedAt(this.state.appointed_date, val)
  }

  submit = () => {
    if (!this.state.form.appointed_at) {
      Taro.showToast({ title: '请填写预约时间', icon: 'none' })
      return
    }
    const loadings = this.state.loadings;
    loadings.submit = true;
    this.setState({ loadings: loadings })

    request.post('/order', { data: this.state.form }).then(data => {
      loadings.submit = false;
      this.setState({ loadings: loadings })
      Taro.redirectTo({ url: '/pages/orders/list' })
    }).catch(err => {
      loadings.submit = false;
      this.setState({ loadings: loadings })
      Taro.showToast({ title: err, icon: 'none' })
    })
  }

  render() {
    return (
      <View className="order-form">
        <AtList className="p-b-sm">
          <AtListItem
            className="order-category"
            title={categoryOpt[this.state.form.category]}
          />
          <AtListItem
            title={this.state.product.shop && this.state.product.shop.name}
            note={this.state.product.shop && this.state.product.shop.address}
            iconInfo={{ value: 'home' }}
          />
          <AtListItem
            title={`${this.state.product.name} ${this.state.product.model}`}
            note={this.state.product.brand && this.state.product.brand.name}
            extraText={this.state.product.sn}
            iconInfo={{ value: 'iphone' }}
          />
          <AtListItem
            title="保养费"
            extraText={`￥${this.state.product.charge || 0}`}
            iconInfo={{ value: 'money' }}
          />
          <AtListItem
            title="预约时间"
            hasBorder={false}
            iconInfo={{ value: 'clock' }}
          />
          <View className="picker-list-item">
            <View className='at-row at-row--wrap'>
              <View className='at-col at-col at-col__offset-1'>
                <Picker mode='date' onChange={this.onDateChange}>
                  <View className='picker'>
                    <View className="text-list-item at-row">
                      <Text>日期：</Text>
                      <View className="dt-picker-value text-muted">{this.state.appointed_date || '请选择'}</View>
                    </View>
                  </View>
                </Picker>
              </View>
              <View className='at-col at-col at-col__offset-1'>
                <Picker mode='time' onChange={this.onTimeChange}>
                  <View className='picker'>
                    <View className="text-list-item at-row">
                      <Text>时间：</Text>
                      <View className="dt-picker-value text-muted">{this.state.appointed_time || '请选择'}</View>
                    </View>
                  </View>
                </Picker>
              </View>
            </View>
          </View>
        </AtList>
        <View className="m-a">
          <AtButton type="primary" loading={this.state.loadings.submit} onClick={this.submit}>提交</AtButton>
        </View>
      </View>
    )
  }
}

export default OrderForm as ComponentClass<PageOwnProps, PageState>
