import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtInput, AtButton } from 'taro-ui'
import request from '../../utils/request'

import './signin.scss'

class Signin extends Component {
  config: Config = {
    navigationBarTitleText: '登录'
  }

  constructor() {
    super(...arguments)
    this.state = {
      form: {
        username: '',
        password: '',
      },
      loading: false,
      disabled: false
    }
  }

  componentWillMount() {
    const user = Taro.getStorageSync('user')
    if (user) {
      this.launch(user.profile.role)
    }
  }

  handleChange(key, value) {
    let updated = {}
    updated[key] = value
    Object.assign(this.state.form, updated)
    this.setState({
      form: this.state.form
    })
  }

  validate = () => {
    if (!this.state.form.username) {
      Taro.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return false
    }
    else if (!this.state.form.password) {
      Taro.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return false
    }
    return true
  }

  launch = (role) => {
    let url = '/pages/service/index'
    if (role !== 1) {
      url = '/pages/home/index'
    }
    Taro.reLaunch({ url: url })
  }

  submit = () => {
    if (!this.validate()) {
      return
    }

    this.setState({
      loading: true,
      disabled: true,
    })

    request.post('/user/login', {
      data: this.state.form,
      complete: (d) => {
        this.setState({
          loading: false,
          disabled: false,
        })
      }
    }).then(data => {
      Taro.setStorageSync('user', data)
      this.launch(data.profile.role)
    }).catch(err => {
      Taro.showToast({ title: err, icon: 'none' })
    })
  }

  render() {
    return (
      <View className='signin padding'>
        <View className="title m-b-md">欢迎登录FIXIT</View>
        <View className="form"
          onSubmit={this.onSubmit.bind(this)}
          onReset={this.onReset.bind(this)}
        >
          <AtInput
            className='m-b'
            name='username'
            type='text'
            placeholder='请输入用户名'
            placeholderClass='input-placeholder'
            value={this.state.username}
            clear={true}
            onChange={this.handleChange.bind(this, 'username')}
          />
          <AtInput
            className='m-b-md'
            name='password'
            type='password'
            placeholder='请输入密码'
            value={this.state.password}
            clear
            onChange={this.handleChange.bind(this, 'password')}
          />
          <AtButton type="primary" loading={loading} disabled={disabled} onClick={this.submit}>登录</AtButton>
        </View>
        <View className="footer text-center">
          <Text className="text-muted">点击即代表同意</Text>
          <Text className="terms text-link text-u-l">《FIXIT法律条款》</Text>
        </View>
      </View>
    )
  }
}

export default Signin
