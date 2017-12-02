$(function () {

  //分页渲染
  var page = 1;
  var pageSize = 5;
  var imgs = [];//用于存储上传图片的结果，点击添加的时候，可以得到上传的图片的地址，数组统计了上传的图片的张图，做校验


  var render = function () {
    //发送ajax请求，获取到商品的数据，渲染到页面中
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (data) {
        console.log(data);

        $("tbody").html(template("tpl", data));


        //2. 分页操作
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //设定版本
          currentPage: page, //当前页
          totalPages: Math.ceil(data.total / data.size), //总页数
          itemTexts: function (type, page, current) {
            //type: 如果是具体的页码，类型是page
            //如果是首页，type：first
            //上一页：type:prev
            //下一页:type:next
            //尾页：last
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              default:
                return page;
            }

          },
          tooltipTitles: function (type, page, current) {
            //type: 如果是具体的页码，类型是page
            //如果是首页，type：first
            //上一页：type:prev
            //下一页:type:next
            //尾页：last
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              default:
                return "跳转到第" + page + "页";
            }

          },
          useBootstrapTooltip: true,
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          }
        });

      }
    });
  }
  render();

  //添加添加按钮，显示模态框
  $(".btn_add").on("click", function () {
    $("#productModal").modal("show");

    //发送ajax请求，查询二级分类
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (data) {
        console.log(data);
        $(".dropdown-menu").html(template("tpl2", data));
      }
    });

  });

  //点击品牌时，需要修改按钮的内容，还需要修改隐藏域brandId的值
  $(".dropdown-menu").on("click", "a", function () {

    //1. 需要修改按钮的内容
    $(".dropdown-text").text($(this).text());
    //2. 修改隐藏域
    $("[name='brandId']").val($(this).data("id"));

    //3. 选择了品牌，需要手动校验成功
    $form.data("bootstrapValidator").updateStatus("brandId", "VALID");

  });


  //表单校验功能
  var $form = $("form");
  $form.bootstrapValidator({
    excluded: [],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //校验规则
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择品牌"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          //库存必须是0以上的数字
          notEmpty: {
            message: "请输入商品库存"
          },
          regexp: {
            //必须1-9开头，后面可以是0个或者多个数字
            regexp: /^[1-9]\d*$/,
            message: "请输入一个不是0开头的库存"
          }
        }
      },
      num: {
        validators: {
          //库存必须是0以上的数字
          notEmpty: {
            message: "请输入商品库存"
          },
          regexp: {
            //必须1-9开头，后面可以是0个或者多个数字
            regexp: /^[1-9]\d*$/,
            message: "请输入一个不是0开头的库存"
          }
        }
      },
      size: {
        validators: {
          //库存必须是0以上的数字
          notEmpty:{
            message:"请输入商品尺码"
          },
          regexp: {
            //必须1-9开头，后面可以是0个或者多个数字
            regexp:/^\d{2}-\d{2}$/,
            message:"请输入正确的尺码，例如(32-46)"
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品价格"
          }
        }
      },
      productLogo:{
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
  });


  //图片上传
  $("#fileupload").fileupload({
    dataType:"json",
    done: function (e, data) {

      if(imgs.length >= 3){
        return false;
      }

      console.log(data.result);
      //动态的往img_box添加一张图片
      $(".img_box").append('<img src="'+data.result.picAddr+'" width="100" height="100" alt="">');
    
      //把这个返回的结果存储起来。
      imgs.push(data.result);

      console.log(imgs);
      
      //判断imgs的长度，如果imgs的长度等于3，说明上传了3张，把productLogo改成校验成功
      if(imgs.length === 3){
        $form.data("bootstrapValidator").updateStatus("productLogo", "VALID");
      }else {
        $form.data("bootstrapValidator").updateStatus("productLogo", "INVALID");
      }

    }
  });


  //给表单注册校验成功事件
  $form.on("success.form.bv", function(e) {
    e.preventDefault();
    //发送ajax请求
    var param = $form.serialize();
    param += "&picName1="+imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
    param += "&picName2="+imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
    param += "&picName3="+imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;

    console.log(param);
    $.ajax({
      type:"post",
      url:"/product/addProduct",
      data: param,
      success:function (data) {
        if(data.success) {
          //1. 关闭模态框
          $("#productModal").modal("hide");
          //2. 重新渲染
          page = 1;
          render();


          //3. 重置样式
          $form.data("bootstrapValidator").resetForm();
          $form[0].reset();

          //清空品牌id的隐藏域
          $("[name='brandId']").val('');

          $(".dropdown-text").text("请选择品牌");
          $(".img_box img").remove();
          //清空数组
          imgs = [];

        }
      }
    });

  })
});