

$(function(){
//    rander();
// 渲染
    var current = 1;
    var pageSize = 5;
    rander();
   function rander(){
    $.ajax({
        type:'get',
        url:'/user/queryUser',
        data:{
            page:current,
            pageSize:pageSize,
        },
        dataType:'json',
        success:function(info){
            console.log(info);
        var userStr = template('user_tmp',info);
            $('tbody').html(userStr);
            current = info.page;
        $("#pagintor").bootstrapPaginator({
                bootstrapMajorVersion:3,
                currentPage:current,
                totalPages: Math.ceil(info.total / pageSize),
                onPageClicked:function(a,b,c,page){
                    console.log(page);
                    current = page;
                    rander();
                }
            })
        }
    })
   }
//    rander();
    
// 点击按钮进行模态框调用
        var id  ;
        var isDelete;
    $('tbody').on('click','.btn',function(){
        $('#user_Modal').modal('show');
         id = $(this).parent().data('id');
        // console.log(id)
        isDelete = $(this).hasClass('btn-danger')? 0 : 1;
        
    })

    $('#btn_sure').click(function(){

        $.ajax({
            type:'post',
            url:"/user/updateUser",
            data:{
                id:id,
                isDelete:isDelete
            },
            dataType:'json',
            success:function(info){
                if(info.success){
                    $('#user_Modal').modal('hide');
                    rander();
                }
            }
        })


    })

})