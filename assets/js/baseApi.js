// 开发环境 
var baseURL = 'http://api-breakingnews-web.itheima.net'
// 测试环境
// var baseURL = 'http://api-breakingnews-web.itheima.net'
// 生产环境
// var baseURL = 'http://api-breakingnews-web.itheima.net'

// 在发送ajax() get() post()之前会触发函数
$.ajaxPrefilter(function (options) {
    // 获取ajax的所有的参数信息
    console.log(options.url);
    options.url = baseURL + options.url
})