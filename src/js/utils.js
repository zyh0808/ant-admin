export const isMobile = (s) => {
  return /^1[0-9]{10}$/.test(s)
}

export const checkEdit = (list) => {
  const result = list.some(item => {
    return item.auth_id === '100001'
  })
  return result
}