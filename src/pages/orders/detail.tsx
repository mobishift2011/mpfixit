import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtFloatLayout, AtIcon, AtRate, AtSteps, AtTextarea, AtAccordion, AtList, AtListItem } from 'taro-ui'
import request from '../../utils/request'

import './detail.scss'

type PageOwnProps = {}

type PageState = {}

class OrderDetail extends Component {
  config: Config = {
    navigationBarTitleText: '订单详情',
    disableScroll: false
  }

  constructor() {
    super(...arguments)
    this.state = {
      userRole: (() => {
        const user = Taro.getStorageSync('user')
        if (user) {
          return user.profile.role
        }
      })(),
      current: 0,
      beforeState: {
        1: '派单中',
        2: '待上门',
        3: '待完工',
        4: '待确认'
      },
      afterState: {
        1: {
          title: '已派单',
          desc: 'assigned_at'
        },
        2: {
          title: '已上门',
          desc: 'arrival_at'
        },
        3: {
          title: '已完工',
          desc: 'complete_at'
        },
        4: {
          title: '已确认',
          desc: 'confirmed_at'
        },
      },
      events: {
        // 1: {
        //   value: 'assign',
        //   label: '指派',
        //   to: 2,
        //   role: 'admin'
        // },
        2: {
          value: 'arrive',
          label: '签到',
          to: 3,
          role: 2,
        },
        3: {
          value: 'complete',
          label: '完工',
          to: 4,
          role: 2,
        },
        4: {
          value: 'confirm',
          label: '确认',
          to: 5,
          role: 1
        }
      },
      steps: [
        // { 'title': '派单', 'desc': '11:25', 'success': true },
        // { 'title': '待上门', 'desc': '1-6 5:00' },
        // { 'title': '服务完成', 'desc': '13:00' },
        // { 'title': '结单确认', 'desc': '13:00' }
      ],
      currEvent: {},
      detail: {},
      isRatingOpened: false,
      ratingText: {
        1: '非常不满意，各方面都很差',
        2: '不满意，比较差',
        3: '一般，还需改善',
        4: '比较满意，仍可改善',
        5: '非常满意，无可挑剔'
      },
      comment: ''
    }
  }

  componentDidMount() {
    const pk = this.$router.params.id
    this.fetchDetail(pk)
  }

  setSteps = (detail) => {
    const steps = []
    const state = detail.state
    const beforeState = this.state.beforeState
    const afterState = this.state.afterState

    for (let i = 1; i < state; i++) {
      let item = afterState[i]
      if (item) {
        steps.push({
          title: item.title,
          desc: (detail[item.desc] || '').substring(5, 16),
          success: true
        })
      }
    }
    let current = steps.length - 1
    for (let i = state; beforeState[i]; i++) {
      if (i == state) {
        current++
      }
      steps.push({ title: beforeState[i] })
    }
    this.setState({ steps: steps, current: current })
  }

  fetchDetail = (pk) => {
    request.get(`/order/${pk}`).then(data => {
      this.setSteps(data)
      const state = { detail: data }
      const event = this.state.events[data.state] || {}
      state.currEvent = event
      this.setState(state)

      if (data.is_confirmed && !data.rating && this.state.userRole === 1) {
        this.showRatingFloat()
      }
    })
  }

  openShopHandle = (value) => {
    this.setState({
      openShop: value
    })
  }

  openProdHandle = (value) => {
    this.setState({
      openProd: value
    })
  }

  openUserHandle = (value) => {
    this.setState({
      openUser: value
    })
  }

  openChargeHandle = (value) => {
    this.setState({
      openCharge: value
    })
  }

  submit = (event) => {
    const state = this.state
    const pk = state.detail.id
    const data = { action: event.value }
    const url = `/order/${pk}/state`
    request.post(url, { data: data }).then(res => {
      if (res == true) {
        Taro.showToast({ title: `${event.label}成功`, icon: 'none' })
        this.fetchDetail(pk)
      }
      else {
        Taro.showToast({ title: '操作失败', icon: 'none' })
      }
    }).catch(err => {
      Taro.showToast({ title: '操作失败', icon: 'none' })
    })
  }

  showRatingFloat() {
    this.setState({
      isRatingOpened: true
    })
  }

  onScoreChanged(val) {
    this.setState({
      score: val
    })
  }

  onCommentChanged(e) {
    this.setState({
      comment: e.target.value
    })
  }

  submitRating() {
    const state = this.state
    const { score, comment } = state
    const pk = state.detail.id
    const url = `/order/${pk}/rating`
    request.post(
      url,
      {
        data: {
          rating: score,
          comment
        }
      }
    ).then(res => {
      if (res === true) {
        this.fetchDetail(pk);
        this.setState({
          isRatingOpened: false
        })
      }
    });
  }

  render() {
    return (
      <View className="order-detail">
        <View className="order-progress p-y">
          <AtSteps
            items={this.state.steps}
            current={this.state.current}
          />
        </View>
        <View className="m-b">
          <AtList className="list-item-appointed">
            <AtListItem
              title={
                this.state.detail.appointed_at &&
                this.state.detail.appointed_at.substring(5, 16)
              }
              hasBorder={false}
              iconInfo={{ value: 'clock' }}
            />
          </AtList>
          <AtAccordion
            title={this.state.detail.shop_name}
            icon={{ value: 'home' }}
            open={this.state.openShop}
            onClick={this.setState.openShopHandle}
          >
            <AtList hasBorder={false}>
              <AtListItem
                title='地址'
                extraText={this.state.detail.shop_address}
                hasBorder={false}
              />
            </AtList>
          </AtAccordion>
          <AtAccordion
            title={this.state.detail.product_name}
            icon={{ value: 'iphone' }}
            open={this.state.openProd}
            onClick={this.setState.openProdHandle}
          >
            <AtList hasBorder={false}>
              <AtListItem
                title='品牌'
                extraText={this.state.detail.product_brand}
              />
              <AtListItem
                title='分类'
                extraText={this.state.detail.product_category}
              />
              <AtListItem
                title='型号'
                extraText={this.state.detail.product_model}
              />
              <AtListItem
                title='规格'
                extraText={this.state.detail.product_specification}
              />
              <AtListItem
                title='序列号'
                extraText={this.state.detail.product_sn}
                hasBorder={false}
              />
            </AtList>
          </AtAccordion>
          {
            this.state.detail.client_user &&
            this.state.userRole === 2 &&
            <AtAccordion
              icon={{ value: 'user' }}
              open={this.state.openUser}
              onClick={this.setState.openUserHandle}
              title={this.state.detail.client_user.name}
            >
              <AtList hasBorder={false}>
                <AtListItem
                  title="联系方式"
                  extraText={this.state.detail.client_user.mobile}
                  hasBorder={false}
                />
              </AtList>
            </AtAccordion>
          }
          {
            this.state.detail.service_user &&
            this.state.userRole === 1 &&
            <AtAccordion
              icon={{ value: 'user' }}
              open={this.state.openUser}
              onClick={this.setState.openUserHandle}
              title={`${this.state.detail.service_user.name} 师傅`}
            >
              <AtList hasBorder={false}>
                <AtListItem
                  title="联系方式"
                  extraText={this.state.detail.service_user.mobile}
                  hasBorder={false}
                />
              </AtList>
            </AtAccordion>
          }
          <AtAccordion
            title={`￥${this.state.detail.price}`}
            icon={{ value: 'money' }}
            open={this.state.openCharge}
            onClick={this.setState.openChargeHandle}
          >
            <AtList hasBorder={false}>
              <AtListItem
                title='保养费'
                extraText={`￥${this.state.detail.price}`}
                hasBorder={false}
              />
            </AtList>
          </AtAccordion>
        </View>
        {
          currEvent.value &&
          currEvent.role === userRole &&
          <View className="m-a">
            <AtButton type="primary" onClick={this.submit.bind(this, this.state.currEvent)}>{this.state.currEvent.label}</AtButton>
          </View>
        }
        {
          this.state.detail.is_confirmed &&
          <View className="ratings p-a">
            {this.state.detail.rating ? (
              <View className="starts" onClick={this.showRatingFloat}>
                <View className="at-row at-row__align--center at-row__justify--around">
                  <View className="at-col at-col-7 text-right">
                    <AtRate value={this.state.detail.rating} />
                  </View>
                  <View className="at-col at-col-4 at-col__offset-1">
                    <Text>{(this.state.detail.rating || 0).toFixed(1)}分</Text>
                    <AtIcon value="chevron-right" size="20"></AtIcon>
                  </View>
                </View>
              </View>
            ) : (
                userRole === 1 &&
                <View className="text-center">
                  <Text className="text-link" onClick={this.showRatingFloat}>评价本次服务</Text>
                </View>
              )
            }
          </View>
        }
        <AtFloatLayout isOpened={isRatingOpened} title="评价">
          <View className="padding">
            <View className="m-b-sm text-center">
              {
                this.state.detail.rating ? (
                  <View>
                    <AtRate value={this.state.detail.rating} size={35} margin={20} />
                    <View className="p-a">{this.state.ratingText[this.state.detail.rating]}</View>
                  </View>
                ) : (
                    <View>
                      <AtRate value={this.state.score} size={35} margin={20} onChange={this.onScoreChanged} />
                      <View className="p-a">{this.state.ratingText[this.state.score]}</View>
                    </View>
                  )
              }
            </View>
            {
              this.state.detail.rating ? (
                this.state.detail.comment &&
                <View>
                  <AtIcon className="m-r-sm" value="message" size="20"></AtIcon>
                  <Text>{this.state.detail.comment}</Text>
                </View>
              ) : (
                  <View>
                    <AtTextarea
                      className="m-b"
                      value={this.state.comment}
                      onChange={this.onCommentChanged}
                      placeholder="匿名评价..."
                    />
                    <AtButton type="primary" disabled={!this.state.score} onClick={this.submitRating}>提交</AtButton>
                  </View>
                )
            }
          </View>
        </AtFloatLayout>
      </View >
    )
  }
}

export default OrderDetail as ComponentClass<PageOwnProps, PageState>
