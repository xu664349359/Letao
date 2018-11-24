

$(function(){

    var currentPage = 1;
    var pageSize = 5;
    var totalPages ;
    rander();
    // 页面渲染
   function rander(){
    $.ajax({
        type:'get',
        url:'/category/querySecondCategoryPaging',
        data:{
            page:currentPage,
            pageSize:pageSize
        },
        dataType:'json',
        success:function(info){
            console.log(info);
            currentPage = info.page;
            totalPages = info.total;
            var cartTwoStr = template('cartTwo_tmp',info);
            $('tbody').html(cartTwoStr);
            $('#pagintor').bootstrapPaginator({
                bootstrapMajorVersion:3,
                currentPage :currentPage,
                totalPages:Math.ceil(totalPages / info.size),
                onPageClicked : function(a,b,c,page){
                    currentPage = page;
                    rander();
                }
            })
        }
    });
   }
//    添加分类

   $('#addcartOne').click(function(){
        $('#cartTwo_Modal').modal('show');
        $.ajax({
            type:'get',
            url:'/category/queryTopCategoryPaging',
            data:{
                page:1,
                pageSize:1000
            },
            dataType:'json',
            success:function(info){
                console.log(info);

                // cartTwo_cart
            var cartStr = template('cartTwo_cart',info);
            $('#cart_drop').html(cartStr);
            }
        });
   });

   //注册委托事件

   $('#cart_drop').on('click','a',function(){
     var tex  = $(this).text();
        $('#drop .txt').text(tex);
       var id = $(this).data('id');
        // console.log(id);
        $('#cart_input').val(id);
        $('#cartTwo_form').data('bootstrapValidator').updateStatus('categoryId','VALID');
        console.log($('#cart_input').val());

   });

//    表单校验
    $('#cartTwo_form').bootstrapValidator({
        excluded:[],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },
          fields:{
            brandName:{
                validators:{
                    notEmpty:{
                        message:'品牌名称不能为空'
                    }
                }
            },
            categoryId:{
                validators:{
                    notEmpty:{
                        message:'一级分类不能为空'
                    }
                }
            },
            brandLogo:{
                validators:{
                    notEmpty:{
                        message:'logo图片不能为空'
                    }
                }
            }
          }
    });

   //添加图片

   $("#fileupload").fileupload({
        dataType:'json',
        done:function(e,data){
        console.log(data);
        var src = data.result.picAddr;
        $('.cart_img img').attr('src',src);
        $('#adress').val(src);
        $('#cartTwo_form').data('bootstrapValidator').updateStatus('brandLogo','VALID')
        }
    });
    // 提交表单，发送ajax
    $('#cartTwo_form').on('success.form.bv',function(e){
        e.preventDefault();
        var data = $('#cartTwo_form').serialize()
        console.log(data);
        
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:$('#cartTwo_form').serialize(),
            // dataType:'josn',
            success:function(info){
                console.log(info);
               if(info.success){
                $('#cartTwo_Modal').modal('hide');
                rander();
                $('#cartTwo_form').data('bootstrapValidator').resetForm(true);
                $('#drop .txt').text('请选择一级分类');
                $('.cart_img img').attr('src','./images/none.png');
               }
            }
        });
    });
});