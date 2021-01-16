// 开发环境 
var baseURL = 'http://api-breakingnews-web.itheima.net'
// 测试环境
// var baseURL = 'http://api-breakingnews-web.itheima.net'
// 生产环境
// var baseURL = 'http://api-breakingnews-web.itheima.net'

// 在发送ajax() get() post()之前会触发函数
$.ajaxPrefilter(function (options) {
    // 获取ajax的所有的参数信息
    options.url = baseURL + options.url

    // 统一为有权限的接口设置headers请求头

    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 登录拦截
    options.complete = function (res) {
        console.log(res);
        var obj = res.responseJSON
        if (obj.status === 1 && obj.message === "身份认证失败！") {
            // 强制清空本地存储
            localStorage.removeItem('token');
            // 强制跳转到登录页面
            location.href = '/login.html'
        }
    }
})