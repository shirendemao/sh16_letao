/**
 * Created by HUCC on 2017/12/3.
 */
$(function () {


  //约定好了： 存储历史记录的key： history, 以后增删改查都应该使用history


  //无论有值没值，都应该给我返回一个数组。
  //如果没有值，返回一个空数组
  function getHistory(){
    //1. 从localStorage中获取到history对应的值
    var history = localStorage.getItem("history")||'[]';
    //2. 把字符串转换成数组
    var arr = JSON.parse(history);
    return arr;
  }

  //渲染功能
  function render() {
    var arr = getHistory();
    $(".lt_history").html( template("tpl",{list:arr}) );
  }

  //列表渲染功能
  //1. 从本地缓存中获取到数据，并且转换成了数组
  //2. 结合模版引擎，把数据渲染出来
  render();



  //清空的逻辑
  //1. 注册点击事件
  //2. 把localStorage中的history清除
  //3. 重新渲染
  $(".lt_history").on("click", ".btn_empty", function () {

    mui.confirm("您是否要清空所有的搜索记录？","温馨提示", ["否", "是"], function (e) {
      //console.log(e);
      if(e.index === 1){
        localStorage.removeItem("history");
        render();
      }
    });


  });


  //删除的逻辑
  //1. 给x注册点击事件
  //2. 获取到点击的x的下标
  //3. 获取本地缓存，得到数组
  //4. 删除数组对应下标的那一项
  //5. 重新设置缓存
  //6. 重新渲染
  $(".lt_history").on("click", ".btn_delete", function () {
    var index = $(this).data("index");

    mui.confirm("您是否要删除这条记录?","温馨提示", ["确定", "取消"], function(e){
      if(e.index == 0){
        var arr = getHistory();
        //console.log(arr);
        //删除arr的index项
        //push pop unshift shift  slice splice
        //slice :数组截取  原数组不变
        arr.splice(index, 1);
        localStorage.setItem("history", JSON.stringify(arr));
        render();

      }
    })



  });




  //添加的逻辑
  //1. 注册点击事件
  //2. 获取到输入的关键字
  //3. 获取本地缓存，得到数组
  //4. 把关键字添加到数组的最前面
  //5. 重新设置缓存
  //6. 重新渲染



  //需求：历史记录不能超过10条
  //     历史记录不能重复，如果重复，放到最上面
  $(".lt_search button").on("click", function () {

    //获取关键字
    var key = $(".lt_search input").val().trim();
    $(".lt_search input").val('');
    if(key === ""){
      mui.toast("请输入搜索关键字");
      return false;
    }

    //获取数组
    var arr = getHistory();


    //判断key在数组中是否存在，如果存在，删除它。
    var index = arr.indexOf(key);//获取key在数组中的下标
    if(index != -1){
      //说明存在.把index对应的值删除
      arr.splice(index, 1);
    }

    //判断，如果数组的长度已经是10了，删除最后一个
    if(arr.length >= 10){
      arr.pop();
    }



    //把关键字添加到数组的最前面
    arr.unshift(key);

    //重新设置缓存
    localStorage.setItem("history", JSON.stringify(arr));

    //重新渲染
    render();

  });

});