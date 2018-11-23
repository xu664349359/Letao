

$(function(){
    // 渲染页面
    var current = 1;
    var pageSize = 5;
    rander();
   function rander(){
    $.ajax({
        type:'get',
        url:'/category/queryTopCategoryPaging',
        data:{
            page:current,
            pageSize:pageSize
        },
        dataType:'json',
        success:function(info){
            // console.log(info);

        var cartOneStr = template('cartOne_tmp',info);
            $('tbody').html(cartOneStr);
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
            });

        }
    });
   }
//    添加分类

   $('#addcartOne').click(function(){

        $('#cartOne_Modal').modal('show');

   });
//    表单校验
   $('#cartOne_form').bootstrapValidator({
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
        },
    fields:{
        categoryName:{
            validators:{
                notEmpty:{
                    message:'一级分类名称不能为空'
                }
            }
        }
    }


});
// 阻止默认提交，利用ajax提交请求

$("#cartOne_form").on('success.form.bv', function (e) {
    e.preventDefault();

    console.log($('#cartOne_form').serialize());
    
    //使用ajax提交逻辑
    $.ajax({
       type:'post',
       url:'/category/addTopCategory',
        data: $('#cartOne_form').serialize(),
        dataType:'json',
        success:function(info){
            console.log(info);
            if(info.success){
                $('#cartOne_Modal').modal('hide');
                $("#cartOne_form")[0].reset();
                $("#cartOne_form").data('bootstrapValidator').resetForm();
                rander();   
            }
        }
    });
}); 
   
 
  

});