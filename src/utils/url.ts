export const qsFromParams = (obj) => {
  const params = {}
  Object.keys(obj).forEach(k => {
    let val = obj[k]
    if (typeof val === 'object') {
      val = val.value
    }
    if (val) {
      params[k] = val
    }
  })
  return Object.keys(params).map(key => key + '=' + params[key]).join('&')
}
