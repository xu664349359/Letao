



$(function(){

    $(document).ajaxStart(function(){
        NProgress.start();
    })

    $(document).ajaxStop(function(){
        NProgress.done();
    })
    //左侧导航下拉效果

    $('#slide').click(function(){

        console.log(this);
        $('#slide_content').stop().slideToggle();

    })

    //侧边栏显示隐藏效果

    $('#hide').click(function(){
        $('.lt_aside').toggleClass('toggle');
        $('.lt_content').toggleClass('toggle');
        $('.lt_content .top').toggleClass('toggle');
    })

    //模态框部分区域

    $('#logOut').click(function(){

        $('#myModal').modal('show');

    })

    // 清除用户登录状态

    $('#logOut_sure').click(function(){
        $.ajax({
            type:'get',
            url:'/employee/employeeLogout',
            dataType:'json',
            success:function(info){
                console.log(info);
                // if(info.success){
                //     location.href = 'login.html';
                // }
                
            }
        })
    })


    //判断用户是否登录
    if(location.href.indexOf('login.html') === -1){
            $.ajax({
            type:'get',
            url:'/employee/checkRootLogin',
            dataType:'json',
            success:function(info){
                // console.log(info);
                if(info.error === 400){
                    location.href = 'login.html';
                }

            }
        })
    }
    

})