$(function () {
    //1. 定义昵称校验规则
    var form = layui.form
    var layer = layui.layer

    form.verify({
        // 属性是规则名 值可以是函数也可以是数组
        nickname: function (value) {
            if (value.length > 6) {
                return ('用户昵称的长度不能超过6位')
            }
        }
    })

    // 2.获取和渲染用户信息
    initUserInfo()
    // 封装获取用户信息的函数
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // 渲染页面
                // 调用form.val()快速为表单赋值 第一个值为form表单中lay-filter=""的值代表为谁赋值，第二个值为要赋值的数据 
                form.val('formUserInfo', res.data)
            }
        });
    }

    // 3.重置表单数据 给form表单绑reset事件和给重置按钮绑定click事件一样
    // 不可以给form绑定click，给按钮绑定reset
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        // 重新获取渲染用户信息
        initUserInfo()
    })

    // 4.监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if ((res.status !== 0)) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功!')
                // 调用父页面里面的方法,重新渲染用户信息
                // window.parent 对应的是他的父页面的widow 调用的方法是全局函数
                window.parent.getUserInfo() 
            }
        });
    })
})