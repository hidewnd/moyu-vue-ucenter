import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Session } from '@/utils/storage';
const baseURL = '/api';

// 配置新建一个 axios 实例
const service = axios.create({
	baseURL: baseURL,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json;charset=UTF-8' },
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		// 在发送请求之前做些什么 token
		if (Session.get('token')) {
			(<any>config.headers).common['Authorization'] = 'Bearer ' + `${Session.get('token')}`;
		}
		if (Session.get('userInfo')) {
			(<any>config.headers).common['user_name'] = `${Session.get('userInfo').username}`;
		}
		if ((<any>config.headers).common['Content-Length']) {
			(<any>config.headers).common['Content-Length'] = undefined;
		}

		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		// 对响应数据做点什么
		const res = response.data;
		// if (res && res.success) {
		// 		// `token` 过期或者账号已在别处登录
		// 		if (res.code === 401) {
		// 			Session.clear(); // 清除浏览器全部临时缓存
		// 			window.location.href = '/'; // 去登录页
		// 			ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
		// 				.then(() => {})
		// 				.catch(() => {});
		// 			return Promise.reject(service.interceptors.response);
		// 		}
		// 		// 未授权
		// 		if (res.code === 403) {
		// 			Session.clear(); // 清除浏览器全部临时缓存
		// 			window.location.href = '/'; // 去登录页
		// 			ElMessageBox.alert('登录授权过期，请重新登录', '提示', {})
		// 			.then(() => {})
		// 			.catch(() => {});
		// 			return Promise.reject(service.interceptors.response);
		// 		}
		// 		if (res.code === 405) {
		// 			ElMessage.error(res.msg);
		// 			return Promise.reject(service.interceptors.response);
		// 		}
		// 		if (res.code === 500 && res.msg) {
		// 			ElMessageBox.alert(res.msg, '提示', {})
		// 				.then(() => {})
		// 				.catch(() => {});
		// 			return Promise.reject(service.interceptors.response);
		// 		}
		// 		return res;
		// }
		if(!res) {
			ElMessage.error('请求失败！请联系管理员');
			return Promise.reject(service.interceptors.response);
		}
		// `token` 过期或者账号已在别处登录
		if (res.code === 4001) {
			Session.clear(); // 清除浏览器全部临时缓存
			window.location.href = '/login'; // 去登录页
			ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
				.then(() => {})
				.catch(() => {});
			return Promise.reject(service.interceptors.response);
		}
		if (res.code === 4003) {
			Session.clear(); // 清除浏览器全部临时缓存
			window.location.href = '/login'; // 去登录页
			ElMessageBox.alert('登录授权过期，请重新登录', '提示', {})
			.then(() => {})
			.catch(() => {});
			return Promise.reject(service.interceptors.response);
		}
		return res;
	},
	(error) => {
		console.log(error);
		// 对响应错误做点什么
		if(error.code === 'ERR_BAD_RESPONSE'){
			ElMessage.error('服务异常');
		} else if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时');
		} else if (error.message == 'Network Error') {
			ElMessage.error('网络连接错误');
		} else {
			ElMessage.error('接口路径找不到');
		}
		return Promise.reject(error);
	}
);

// 导出 axios 实例
export default service;
