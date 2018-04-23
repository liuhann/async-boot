import * as axios from 'axios';

import {isPlainObject} from './lang';

/**
 * 基于axios封装的一套服务调用客户端。
 * @class HttpClient
 * @author liuhan
 */
class HttpClient {
    /**
     * 通过一些默认参数初始化http客户端。
     * @param {HttpClient.RequestOpts} baseConf
     */
    constructor(baseConf={}) {
        this.options =  Object.assign({
            withCredentials: true
        }, baseConf);
        this.instance = axios.create(this.options);
    }

    /**
     * 根据配置获取一个client实例
     * @param baseConf
     */
    static getInstance(baseConf) {
        return new HttpClient(baseConf);
    }

    /**
     * 发出http请求时可选的配置项信息。通常情况下，一些通用的选项可以用过初始化时先行配置
     *
     * @typedef {Object} HttpClient.RequestOpts
     * @property {string} url - 请求地址。通过post、get等方式调用时次参数不用传输。
     * @property {string} [method="get"] http请求方法
     * @property {string} [baseURL] - 请求基础地址 例如
     *
     *          'https://some-domain.com/api/'
     * @property {object} [headers] 请求头信息， 例如
     *
     *          {
     *              'X-Requested-With':
     *              'XMLHttpRequest'
     *          }
     *
     * @property {object} [params] url中携带的请求参数
     * @property {any} [data] POST、PUT等请求携带的body体信息 可以为以下类型
     *
     *                      object - 提交JSON数据
     *                      FormData - 上传
     *
     * @property {number} [timeout=1000] 超时时间
     * @property {string} [responseType="json"] 自动处理的返回数据类型
     * @property {boolean} [ignoreError] 是否忽略statusCode非2000000的情况。true表示忽略，即返回非2000000框架并不处理。
     * @property {function} onUploadProgress 上传进度的回调函数
     *
     *              onUploadProgress: function (progressEvent) {
     *
     *              },
     *
     * @property {function} onDownloadProgress 下载进度信息
     *
     *          onDownloadProgress: function (progressEvent) {
     *
     *          },
     *
     * @property {function} validateStatus 根据返回httpStatusCode，决定何种code是正常流程
     */
    /**
     * 调用返回的结果schema
     * @typedef HttpClient.Response
     * @property {object} data 返回数据
     * @property {number} status 返回状态码
     * @property {string} statusText 'OK'
     * @property {object} headers {}
     * @property {HttpClient.RequestOpts} config
     * @property {object} request
     */

    /**
     * 发出HTTP GET请求。
     * @param {string} url 请求服务的地址，一般这个地址写成相对路径例如 /user/add
     * @param {HttpClient.RequestOpts} [param]  GET的请求参数
     * @param {Boolean||Object} [ignoreError=false]  bool值表示是否忽略statusCode非2000000的情况。true表示忽略，即返回非2000000框架并不处理。  传入Object值，可以修改  @see HttpClient.RequestOpts 的配置
     * @return Promise
     */
    async get(url, param={}, extraConfig={}) {
        let config = {};
        config.url = url;
        config.method = 'get';
        config.params = param;

        if (isPlainObject(extraConfig)) {
	        config = Object.assign(extraConfig, config);
        }
	    let result = await this.request(config);
	    return result.data;
    }

    /**
     * 发出HTTP DELETE请求。
     * @param {string} url 请求地址，请求服务的地址，一般这个地址写成相对路径例如 /user/add
     * @param {HttpClient.RequestOpts} [data]  Delete的body体内容
     * @param {HttpClient.RequestOpts} [query]  Delete的url query string
     * @return Promise
     */
    async delete(url, data={}, query={}, ignoreError=false) {
        const config = {};
        config.url = url;
        config.method = 'delete';
        config.params = query;
        config.data = data;
        let result = await this.request(config);
        return result.data;
    }

    /**
     * 发起一个rest请求。
     * @param {HttpClient.RequestOpts} config axios请求参数
     * @returns {Promise.<*>}
     */
    async request(config) {
        const result = await this.instance.request(config);
        return result;
    }
    /**
     * 发出HTTP POST请求
     * @param {String} url 请求服务的地址，一般这个地址写成相对路径例如 /user/add
     * @param {Object} data 请求body数据
     * @param {Object|Boolean} [ignoreError=false] bool值表示是否忽略statusCode非2000000的情况。true表示忽略，即返回非2000000框架并不处理。  传入Object值，可以修改  @see HttpClient.RequestOpts 的配置
     * @param {Boolean} [ignoreError=false] 是否忽略statusCode非2000000的情况
     * @param config
     */
    async post(url, data={}, extraConfig={}) {
        let config = {};
        config.url = url;
        config.method = 'post';
        config.data = data;

	    if (isPlainObject(extraConfig)) {
		    config = Object.assign(extraConfig, config);
	    }
        let result = await this.request(config);
        return result.data;
    }


	async put(url, data={}, extraConfig={}) {
		let config = {};
		config.url = url;
		config.method = 'put';
		config.data = data;

		if (isPlainObject(extraConfig)) {
			config = Object.assign(extraConfig, config);
		}

		let result = await this.request(config);
		return result.data;
	}

	async patch(url, data={}, extraConfig={}) {
		let config = {};
		config.url = url;
		config.method = 'patch';
		config.data = data;

		if (isPlainObject(extraConfig)) {
			config = Object.assign(extraConfig, config);
		}

		let result = await this.request(config);
		return result.data;
	}

    /**
     * 请求的回调拦截器
     * @callback HttpClient.requestInteceptor
     * @param {HttpClient.RequestOpts} config 请求项配置信息，可以修改后返回
     * @return  {HttpClient.RequestOpts|Promise.reject} 修改后的请求配置信息或者拒绝请求。
     */

    /**
     * 增加请求拦截处理器
     * @param {HttpClient.requestInteceptor} inteceptor 回调拦截器
     * @example
     *
     *      client.addRequestInteceptor(function (config) {
     *             //此处修改请求项配置信息  @see HttpClient.RequestOpts
     *              return config;
     *          }, function (error) {
     *              // Do something with request error
     *              return Promise.reject(error);
     *      }
     */
    addRequestInteceptor(inteceptor) {
        this.instance.interceptors.request.use(inteceptor);
    }

    /**
     * HTTP返回结果后的后续处理
     * @callback HttpClient.responseInterceptor
     * @param {HttpClient.Response} config 响应结果
     * @return  {HttpClient.RequestOpts|Promise.reject} 修改后的请求配置信息或者拒绝请求。
     */
    addResponseInteceptor(inteceptor, interceptData) {
        this.instance.interceptors.response.use(inteceptor);
    }

}

export default HttpClient;
