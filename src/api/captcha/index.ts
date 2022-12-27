import request from '@/utils/request'

export function CaptchaApi(){
  return {
    // 获取验证图片  以及token
    captchaGet(param: object) {
      return request({
        url: '/uc/captcha/get',
        method: 'post',
        data: param,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json; charset=UTF-8'
        }
      });
    },
    // 滑动或者点选验证
    captchaCheck(param: object) {
      return request({
        url: '/uc/captcha/check',
        method: 'post',
        data: param,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json; charset=UTF-8'
        }
      })
    },
  }
}