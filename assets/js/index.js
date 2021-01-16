$(function () {
    // 1.获取用户信息并渲染用户名和头像
    // 调用函数获取用户的基本信息
    getUserInfo();
    // 2. 退出功能(点击按钮实现退出功能)
    var layer = layui.layer
    $('#btnLogout').on('click',function () {
        // 提示用户 是否确认退出
        layer.confirm('是否确认退出登录?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 2.1 清空本地存储中的token
            localStorage.removeItem('token');
            // 2.2 重新跳转到登录页面
            location.href = '/login.html';
            // 2.3 关闭confirm询问框
            layer.close(index);
          });
    })
})
// 获取用户的基本信息 必须是全局函数 后面其他页面也要用
function getUserInfo() {
    var layer = layui.layer
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // headers 就是请求头的配置对象
        // headers: {
        //     Authorization : localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if(res.status !== 0){
                return layer.msg('获取用户信息失败')
            }
            // 调用renderAvatar()函数渲染头像 和信息
            renderAvatar(res.data)
        },
        // 无论成功还是失败都会调动complete函数
        // complete:function (res) {
        //     console.log(res);
        //     // 在complete回调函数中可以通过responseJSON拿到服务器返回回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败') {
        //         // 强制清空本地存储
        //         localStorage.removeItem('token');
        //         // 强制跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    });
}
// 渲染用户头像和信息
function renderAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username
    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染图片头像 判断有没有图片头像
    if(user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }else{
        // 渲染文本头像
        // 隐藏图片头像
        $('.layui-nav-img').hide();
        // 取到用户名称的第一个字母并转化为大写
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }
}