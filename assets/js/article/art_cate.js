$(function () {
    var form = layui.form
    // 初始化文章列表
    var layer = layui.layer
    initArtCateList()
    // 获取文章列表
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                var htmlStr = template('tpl_table', res)
                $('tbody').html(htmlStr)
            }
        });
    }
    var indexAdd = null
    // 2.显示添加区域
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            // 不要按钮
            type: 1,
            // 指定款高
            area: ['500px', '260px'],
            title: '添加文章分类',
            content: $('#dialog_add').html()
        });

    })

    // 3.通过代理的形式绑定submit事件
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败');
                }
                // 渲染页面
                initArtCateList()
                layer.msg('新增分类成功')
                // 通过索引来关闭弹出层
                layer.close(indexAdd)
            }
        });
    })

    // 4.显示修改form表单
    var indexEdit = null
    $('tbody').on('click', '.btn_edit', function () {
        // 弹出一个修改数据的层
        indexEdit = layer.open({
            type: 1,
            // 指定款高
            area: ['500px', '260px'],
            title: '修改文章分类',
            content: $('#dialog_edit').html()
        });

        var id = $(this).attr('data-id')
        // 发起请求
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                form.val('form_edit', res.data)
            }
        });
    })

    // 通过代理形式未修改分类绑定submit
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('更新数据分类成功')
                // 渲染页面
                initArtCateList();
                // 关闭弹出层
                layer.close(indexEdit)
            }
        });
    })

    // 通过代理形式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn_delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否确认删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                data:$(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功')
                    initArtCateList()
                    layer.close(index);
                }
            });
        });
    })

})