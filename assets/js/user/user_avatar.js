$(function () {
    var layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 2.选择图片
    $('#btnChooseImage').on('click', function () {
        // 点击上传时出现文件上传框，相当于点击了上传文件
        $('#file').click();

    })
    // 3.为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        var filelist = e.target.files
        // 非空校验
        if (filelist.length === 0) {
            return layer.msg('请选择照片')
        }
        // 拿到用户上传的文件
        var file = e.target.files[0]
        // 把file在内存中生成一个地址
        var ingURL = URL.createObjectURL(file);
        // 重新渲染裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', ingURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 4.确定按钮修改头像
    $('#btnUpload').on('click', function () {
        // 获取base64格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: {
                avatar : dataURL
            },
            success: function (res) {
                if(res.status !== 0) {
                    return layer.msg('更换头像失败')
                }
                layer.msg('更换头像成功')
                // 调用父页面的渲染页面
                window.parent.getUserInfo()
            }
        });
    })
})