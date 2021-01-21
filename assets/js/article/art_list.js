$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    // 定义一个查询参数对象 将来查询文章使用
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, //每页显示多少条数据 默认显示两条
        cate_id: '', //文章分类的 Id
        state: '' // 文章的状态，可选值有：已发布、草稿
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        var dt = new Date(data)
        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    initTable()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {

                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl_table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页
                renderPage(res.total)
            }
        });
    }

    initCate()
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染页面
                var htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr);
                form.render()
            }
        });
    }

    // 为筛选表单绑定submit事件
    $('#form_search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为获取到的值填充到q里面 根据最新的q 
        q.cate_id = cate_id
        q.state = state
        // 重新渲染页面
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',//分页容器的id
            count: total,// 总的数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认选中哪页
            // 分页发生切换时 触发jump函数
            // 触发jump回调的方式
            // 1.点击页码的时候 触发jump回调
            // 2.调用laypage.render()方法，就会调用jump回调
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                // 可以通过first值 来判断是那种方式触发的
                // 值为undefind 就是第一种
                // 值为true就是第二种
                // 把最新的页码值赋值到q这个查询参数对象
                q.pagenum = obj.curr
                // 把最新的条目数复制到q这个查询参数对象身上
                q.pagesize = obj.limit
                if (!first) {
                    // 根据最新的q获取对应的数据列表并渲染表格
                    initTable()
                }
            }
        })

    }

    // 通过代理的方式，为删除按钮绑定事件
    $('tbody').on('click', '.btn_delete', function () {
        // 获取当前页面按钮的个数
        var len = $('.btn_delete').length
        console.log(len);
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除文章成功')
                    // 当数据删除完成后需要判断当前这一页中是否还有剩余数据
                    // 如果没有让页码值减一
                    // 重新加载页面
                    if (len === 1) {
                        // 如果len的值等于1 就说明删除以后页面上就没有数据了让页码值减一
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            });
            layer.close(index);
        });
    })
})