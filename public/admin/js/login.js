$(function(){

  //表单校验功能
  //1. 用户名不能为空
  //2. 密码不能为空
  //3. 密码长度是6-12
  var $form = $("form");
  $form.bootstrapValidator({
    //配置校验的小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //配置的参数
    //配置校验规则,需要校验的字段,对应表单中的name属性
    fields: {
      username:{
        //配置username所有的校验规则
        validators: {
          //非空校验
          notEmpty: {
            message: "用户名不能为空"
          }
        }
      },
      password:{
        validators:{
          notEmpty: {
            message:"密码不能为空"
          },
          stringLength: {
            min:6,
            max:12,
            message:"密码长度在6-12位"
          }
        }
      }
    }
  });


  //给表单注册校验成功事件   success.form.bv
  $form.on("success.form.bv", function(e) {

    //阻止浏览器的默认行为
    e.preventDefault();

    
    console.log("呵呵");
    //发送ajax请求，登录
    $.ajax({
      type:"post",
      url:"/employee/employeeLogin",
      //dataType:'json',  //如果后端返回的相应头有text/html
      data: $form.serialize(),
      success:function (data) {
        if(data.success){
          //跳转到首页
          location.href = "index.html";
        }

        if(data.error == 1000){
          alert("用户名不存在");
        }
        if(data.error == 1001){
          alert("密码错误");
        }

      }
    });
    

  });

});