import Taro from '@tarojs/taro'

const _request = (url, method, options) => {
  url = 'http://127.0.0.1/api/v1' + url
  const header = Object.assign(
    options.header || {},
    {
      'Authorization': (Taro.getStorageSync('user') || {}).token,
      'Content-Type': 'application/json'
    }
  )
  const p = new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: options.data || {},
      header: header,
      method: method,
      dataType: options.dataType || 'json',
      success: res => {
        const code = res.statusCode;
        if ([200, 201].includes(code)) {
          resolve(res.data)
        }
        else if (code === 401) {
          Taro.reLaunch({ url: '/pages/signin/signin' })
        }
        else {
          reject(res.data.message || res.data.error)
        }
      },
      fail: (err) => {
        reject(err.errMsg)
      },
      complete: (d) => {
        if (options.complete) {
          options.complete(d)
        }
      }
    });
  })

  return p
}

export default {
  get: (url, options = {}) => {
    return _request(url, 'GET', options)
  },
  post: (url, options = {}) => {
    return _request(url, 'POST', options)
  },
  patch: (url, options = {}) => {
    return _request(url, 'PATCH', options)
  },
  delete: (url, options = {}) => {
    return _request(url, 'DELETE', options)
  }
}
