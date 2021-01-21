$(function () {
    var layer = layui.layer
    var form = layui.form
    function initForm() {
        var id = location.search.split('=')[1]
        $.ajax({
            type: "GET",
            url: "/my/article/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染页面
                form.val('form_edit', res.data);
                // 富文本赋值
                tinyMCE.activeEditor.setContent(res.data.content);
                // 图片
                var newImgURL = baseURL + res.data.cover_img
                // 渲染图片
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            }
        });
    }

    // console.log( window.parent.document.getElementById('art_list'));

    // 定义加载文章分类的方法
    initCate()
    // 初始化富文本编辑器
    initEditor()
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始胡文章分类失败')
                }
                // 调用模板引擎 渲染页面
                var htmStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmStr)
                // 调用layui的form方法重新渲染页面
                form.render()
                // 文章分类渲染完毕再调用渲染
                initForm()
                form.render()
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 点击按钮选中图片
    $('#btnChooseImg').on('click', function () {
        $('#coverFile').click()
    })

    // 根据文件的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        var files = e.target.files
        // 非空判断
        if (files.length === 0) {
            return;
        }
        // 根据文件创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'

    // 为保存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定提交事件
    $('#form_pub').on('submit', function (e) {
        // 1.阻止默认提交行为
        e.preventDefault()
        // 2.基于form表单快速创建formdata对象
        var fd = new FormData($(this)[0]);
        // 3.将文章的状态存到fd中
        fd.append('state', art_state)

        // 4.将封面裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象存储到fd中
                fd.append('cover_img', blob)
                // 这是异步函数，所以ajax必须在这里面发送，不然参数不全
                // 6.提交ajax 
                publishArticle(fd)
            })
    })


    // 定义一个发送ajax函数
    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/edit",
            data: fd,
            // 注意 如果向服务器提交的是formdate格式的数据 必须添加两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('修改文章成功')
                // 发表成功后跳转到列表页
                window.parent.document.getElementById('art_list').click()
            }
        });
    }
})