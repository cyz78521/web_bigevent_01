$(function () {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 点击去登录的账号
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 2.自定义校验规则
    // 只要引入了layui.all.js，就会有layui.form对象
    // 从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫pwd的校验规则 属性就是定义的规则名称
        pwd: [
            // 数组的第一项为正则表达式
            /^[\S]{6,12}$/,
            // 数组的第二项为提示信息
            '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码输入是否一致规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等号判断
            // 如果不相等则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            // 只判断有问题的情况 ，没问题，直接通过
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 3.注册功能
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发送ajax请求
        var data = {
            username: $('.reg-box [name=username]').val(),
            password: $('.reg-box [name=password]').val()
        }
        $.ajax({
            type: "POST",
            url: "/api/reguser",
            data: data,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功,请登录')
                //模拟人的点击行为
                $('#link_login').click()
                // 重置form表单
                $('#form_reg')[0].reset()
            }
        });
    })

    // 4.登录
    // 监听登录表单的提交事件
    $('#form_login').submit(function(e){
        // 阻止默认行为
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/login",
            // 快速获取表单里面的值
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                // 将登陆成功得到的token值存到localStorage中
                localStorage.setItem('token',res.token)
                location.href = '/index.html'
            }
        });
    })
})