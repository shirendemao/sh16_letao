$(function (){

  var page = 1;
  var pageSize = 2;
  //发送ajax请求，渲染页面
  var render = function () {
    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:page,
        pageSize:pageSize
      },
      success:function (data){
        console.log(data);

        //使用模版引擎渲染到页面
        $("tbody").html( template("tpl" ,data )  );

        //渲染分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:page,
          totalPages: Math.ceil(data.total/data.size),
          onPageClicked: function (a,b,c,p){
            page = p;
            render();
          }
        });

      }
    });
  }
  render();


  //点击添加分类，显示模态框
  $(".btn_add").on("click", function () {

    $("#firstModal").modal("show");

  });

});