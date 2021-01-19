$(function () {
    var form = layui.form
    // 1.定义密码规则(3个)
    form.verify({
        // 所有密码都要履行的规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 新密码的规则
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新密码旧密码不能相同'
            }
        },
        // 确认密码的规则
        repwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })
    // 2.修改密码
    $('.layui-form').on('submit',function (e) {
            // 阻止表单的默认提交行为
            e.preventDefault();
            // 发送ajax请求 
            $.ajax({
                type: "POST",
                url: "/my/updatepwd",
                data: $(this).serialize(),
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layui.layer.msg('修改密码失败！')
                    }
                    layui.layer.msg('修改密码成功')
                    // 重置表单
                    $('.layui-form')[0].reset()
                }
            });
    })
})