import request from '@/utils/request'

export function LoginRegisterApi(){
  return {
    // 登录
    login(params: object){
      return request({
        url: '/uc/user/login',
        method: 'post',
        data: params,
      });
    },
    // 登出
    logout(){
			return request({
				url: '/uc/user/logout',
				method: 'post',
			});
		},
    // 检查token
    checkToken(){
			return request({
				url: '/uc/user/token',
				method: 'post',
			});
		},
    // 注册
    register: (params?: object) => {
      return request({
				url: '/uc/user/register',
				method: 'post',
				data: params,	
			});
    },
    // 重置密码
    resetPassword: (params: object) => {
      return request({
        url: '/uc/user/password/reset',
        data: params,
        method: 'post'
      })
    }
  }
  
}

export function UserExApi() {
  return {
		// 注册发送游戏验证码
    sendRegisterMail: (params?: any) => {
      return request({
				url: '/uc/ex/send/mail/register?verification=' + params.verification + '&mail=' + params.mail,
				method: 'post',
			});
    },
		// 重置密码发送游戏验证码
    sendForgotMail: (params?: any) => {
      return request({
				url: '/uc/ex/send/mail/forgot?verification=' + params.verification + '&mail=' + params.mail,
				method: 'post',
			});
    },
  }
}