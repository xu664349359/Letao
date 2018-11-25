$(function(){

        var current = 1;
        var pageSize = 3;
        rander();
    function rander(){
        $.ajax({
            type:'get',
            url:'/product/queryProductDetailList',
            data:{
                page:current,
                pageSize:pageSize
            },
            dataType:'json',
            success:function(info){
                console.log(info);
                var productStr = template('product_tmp',info);
                $('tbody').html(productStr);
                    // var current = info.page;
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
    
            },
            // error:function(info){
            //     console.log(info)
            // }
    
        });
    }
    // 添加商品

    $('#addproduct').click(function(){
        $('#product_Modal').modal('show');
        $.ajax({
            type:'get',
            url:'/category/querySecondCategoryPaging',
            data:{
                page:1,
                pageSize:1000
            },
            dataType:'json',
            success:function(info){
                // console.log(info);
                var productStr = template('product_cart',info);
                $('#cart_drop').html(productStr);
            }
        });
    });
    //委托事件
    $('#cart_drop').on('click','a',function (){
      var txt = $(this).text();
      $('#drop .txt').text(txt);
     var id = $(this).data('id');     
     $('#cart_input').val(id);
     $('#product_form').data('bootstrapValidator').updateStatus('brandId','VALID') ; 
    });

    // 图片区域同步地址
    var arr = [];
    $('#fileupload').fileupload({
        dataType:'json',
        done:function(e,data){
            console.log(data); 
           
        var result = data.result;
        var address = result.picAddr;
         $('#adress').val(address); 
        arr.unshift(result);  
        $('.cart_img').prepend(' <img src='+ address +' alt="" width = "100px">');
            // console.log(arr.length);
            if(arr.length > 3){
                arr.pop();
                $('.cart_img img:last-of-type').remove();
            }
            if(arr.length === 3){
                $('#product_form').data('bootstrapValidator').updateStatus('picAdress','VALID')  ;
                console.log(arr);
                
              
            //  console.log(str);
            }
       
        }

    });
   
        // 表单校验

        $('#product_form').bootstrapValidator({

            excluded:[],
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
              },
              fields:{
                proName:{
                    validators:{
                        notEmpty:{
                            message:'产品名称不能为空'
                        }
                    }
                },
                oldPrice:{
                    validators:{
                        notEmpty:{
                            message:'请输入产品原价'
                        }
                    }
                },
                price:{
                    validators:{
                        notEmpty:{
                            message:'请输入产品现价'
                        }
                    } 
                },
                proDesc:{
                    validators:{
                        notEmpty:{
                            message:'产品描述不能为空'
                        }
                    } 
                },
                brandId:{
                    validators:{
                        notEmpty:{
                            message:'二级分类不能为空'
                        }
                    }   
                },
                num:{
                    validators:{
                        notEmpty:{
                            message:'库存不能为空'
                            
                        },
                        regexp:{
                            regexp:/^[1-9]*$/,
                            message:'请输入非零数字或英文字体'
                        }
                    }  
                },
                size:{
                    validators:{
                        notEmpty:{
                            message:'尺码不能为空'
                            
                        },
                        regexp:{
                            regexp:/^[1-9]\d-[1-9]\d$/,
                            message:'请输入格式xx-xx格式'
                        }
                    }  
                },
                picAdress:{
                    validators:{
                        notEmpty:{
                            message:'请上传3张图片'
                        }
                    } 
                }
              }

        });

        //阻止默认提交。发送数据
              
                
        $("#product_form").on('success.form.bv', function (e) {

            e.preventDefault();
            var str = $('#product_form').serialize();
            str += '&picName1='+arr[0].picName+'&picAddr1='+arr[0].picAddr;    
            str += '&picName2='+arr[1].picName+'&picAddr2='+arr[1].picAddr;    
            str += '&picName3='+arr[2].picName+'&picAddr3='+arr[2].picAddr;    
         
            $.ajax({
                type:'post',
                url:'/product/addProduct',
                data:str,
                dataType:'json',
                success:function(info){
                    // console.log(info);
                    if(info.success){
                        $('#product_Modal').modal('hide');
                        rander();
                        $('#product_form').data('bootstrapValidator').resetForm(true);
                        $('#drop .txt').text('请选择二级分类');
                        $('.cart_img img').remove
                    }
                }
            });
            //使用ajax提交逻辑
        });

});