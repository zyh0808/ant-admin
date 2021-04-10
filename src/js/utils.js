export const isMobile = (s) => {
  return /^1[0-9]{10}$/.test(s)
}

export const checkEdit = (list) => {
  const result = list.some(item => {
    return item.auth_id === '100001'
  })
  return result
}

export function checkPhone (value) {
  if (!(/^1[3456789]\d{9}$/.test(value))) {
    return false;
  }
  return true
}

export function dateToTimestamp (value) {
  // console.log(value)
  const timestamp = Date.parse(value) / 1000
  return timestamp
}

export function dateFormat (fmt, date) {
  console.log(date)
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}

export function checkIDCard (value) {
  // 加权因子
  let weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  // 校验码
  let check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

  let code = value + "";
  let last = value[17];//最后一位

  let seventeen = code.substring(0, 17);

  // ISO 7064:1983.MOD 11-2
  // 判断最后一位校验码是否正确
  let arr = seventeen.split("");
  let len = arr.length;
  let num = 0;
  for (let i = 0; i < len; i++) {
    num = num + arr[i] * weight_factor[i];
  }

  // 获取余数
  let resisue = num % 11;
  let last_no = check_code[resisue];
  let idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

  // 判断格式是否正确
  let format = idcard_patter.test(value);

  // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
  if (last === last_no && format) {
    return true
  } else {
    return false
  }
}

export function checkEmail (value) {
  if (!(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value))) {
    return false
  }
  return true
}

export function checkPostCode (value) {
  if (!(/^[1-9][0-9]{5}$/.test(value))) {
    return false
  }
  return true
}

export function PrefixInteger (num, length) {
  return (Array(length).join('0') + num).slice(-length);
}