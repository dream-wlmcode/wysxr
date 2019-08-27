$(function(){
    //初始化tab
    initTabContent();
    $("#nav-tab").find("a.nav-item").click(function(event) {
      $(this).addClass('active').siblings('.nav-item').removeClass('active');
      var _index = $(this).index();
      $("#nav-tabContent").find(".tab-pane").eq(_index).addClass('show active').siblings('.tab-pane').removeClass('show active');
    });


    /*********************************** 基本信息设置 s**********************************/

    //初始化头像
    $("#Avatar").fileinput({
        language : 'zh',
        allowedFileExtensions: ['jpg','png'],//接收的文件后缀
        theme: 'fas',
        showUpload: false,
        showCaption: false,
        browseClass: "btn btn-primary btn-lg",
        fileType: "any",
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        overwriteInitial: false,
        initialPreviewAsData: true,
        initialPreview: [],
        initialPreviewConfig: []
    });
    /*********************************** 基本信息设置 e**********************************/



    /*********************************** 忘记密码 s**********************************/
    //忘记密码发送验证码
    $("#sendCodeBtn").click(function(event) {
      var Email = $("#Email").val();
      if(isEmail("Email",Email)){
              $(this).attr("disabled", "disabled").addClass("bg_gray");
              var isOK = false, json = null, RequstKey = "";
              if(Key != undefined){
                  RequstKey = Key;
              }else{
                  RequstKey = "请求口令";
              }
              $.ajax({
                  type: 'post', 
                  data: { Receiver: Email, RequstKey:RequstKey},
                  url: domainUrl+'api/Users/SendRegCode',
                  success: function (data) {
                      if (data != "") {
                          json = data;
                          if (json.ResultCode == 0){
                              console.log(json.Message);
                              isOK = true;
                          }
                      }
                  },
                  beforeSend: function (xhr) {},
                  error: function (xhr, type) {},
                  complete: function (xhr, status) {
                      if (isOK) {
                          setTime();
                          art.dialog({
                              time: 3000,
                              content:"发送成功，1分钟有效",
                              cancel:false,
                              fixed: true,
                              lock: true,
                              width: 220,
                              ok:function(){}
                          }); 
                      }
                      else {
                          if (json != null) {
                              if (json.status == -2) {
                                  art.dialog({
                                      content:"该邮箱已注册过,请用其他邮箱注册！",
                                      cancel:false,
                                      fixed: true,
                                      lock: true,
                                      width: 200,
                                      ok:function(){}
                                  });
                              } else {
                                  art.dialog({
                                      content:json.msg,
                                      cancel:false,
                                      fixed: true,
                                      lock: true,
                                      width: 200,
                                      ok:function(){}
                                  });
                              }
                          }
                      }
                  }
              });

              event.stopPropagation();
      }
    });

    //保存忘记密码设置
    $("#save_forgetpd_set").click(function(event) {
        var UserName = $("#UserName").val();
        var Email = $("#Email").val();
        var VerCode = $("#VerCode").val();
        var Password = $("#Password").val();
        var param = {
            UserName:UserName,
            Email:Email,
            VerCode:VerCode,
            Password:Password,
        };
        $.ajax({
            type: 'post', 
            data: param,
            url: domainUrl+'api/Users/ForGetPwd',
            success: function (data) {
                if (data != "") {
                    json = data;
                    if (json.ResultCode == 0){
                        console.log(json.Message);
                        art.dialog({
                            content:json.Message,
                            cancel:false,
                            fixed: true,
                            lock: true,
                            width: 200,
                            ok:function(){
                              window.location.href="sign-in.html?id=1";
                            }
                        });
                    }
                }
            },
            error: function (xhr, type) {},
        });
    });

    //重置忘记密码
    $("#reset_forgetpd").click(function(event) {
        $("#UserName").val("");
        $("#Email").val("");
        $("#VerCode").val("");
        $("#Password").val("");
    });
    /*********************************** 忘记密码 e**********************************/










   /*********************************** 修改密码 s**********************************/

    //保存修改密码设置
    $("#save_modify_set").click(function(event) {
        var Password = $("#newPassword").val();
        if($.trim(Password).length == 0){
            art.dialog({
                content:"请输入新密码",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok:function(){}
            });
            return; 
        }

        console.log(Password);

        if(!isPasswd(Password)){
            art.dialog({
                content:"密码只能输入6-20个字母、数字、下划线！",
                cancel:false,
                fixed: true,
                lock: true,
                width: 260,
                ok:function(){}
            });
            return; 
        }

        var RequstKey = "";
        if(Key != undefined){
            RequstKey = Key;
        }else{
            RequstKey = "请求口令";
        }
        $.ajax({
            type: 'post', 
            data: {Password:Password,RequstKey:RequstKey},
            url: domainUrl+'api/Users/NewPwd',
            success: function (data) {
                if (data != "") {
                    json = data;
                    if (json.ResultCode == 0){
                        console.log(json.Message);
                        art.dialog({
                            content:json.Message,
                            cancel:false,
                            fixed: true,
                            lock: true,
                            width: 200,
                            ok:function(){
                              window.location.href="sign-in.html?id=1";
                            }
                        });
                    }else if(json.ResultCode == 2){
                        console.log(json.Message);
                        art.dialog({
                            content:json.Message,
                            cancel:false,
                            fixed: true,
                            lock: true,
                            width: 200,
                            ok:function(){
                              window.location.href="sign-in.html?id=1";
                            }
                        });
                    }
                }
            },
            error: function (xhr, type) {},
        }); 
    });

    //重置修改密码
    $("#reset_modify").click(function(event) {
        $("#newPassword").val("");
    });
   /*********************************** 修改密码 e***********************************/




});


/*初始化tab*/
function initTabContent(){
    var id = getQueryString("id");
    if(id != undefined){
        console.log(id);
      	switch(id){
          case "0":
            $("#nav-userinfoset-tab").addClass('active').siblings('a.nav-item').removeClass('active');
            $("#nav-userinfoset").addClass('show active').siblings('.tab-pane').removeClass('show active');
            break;
      		case "1":
      			$("#nav-forgetpassword-tab").addClass('active').siblings('a.nav-item').removeClass('active');
      			$("#nav-forgetpassword").addClass('show active').siblings('.tab-pane').removeClass('show active');
      			break;
      		case "2":
      			$("#nav-password-tab").addClass('active').siblings('a.nav-item').removeClass('active');
      			$("#nav-password").addClass('show active').siblings('.tab-pane').removeClass('show active');
      			break;
      		default:
            $("#nav-userinfoset-tab").addClass('active').siblings('a.nav-item').removeClass('active');
            $("#nav-userinfoset").addClass('show active').siblings('.tab-pane').removeClass('show active');
      	}
    }   
}







/*发送验证码设计倒计时时间方法*/
function setTime(){
    var intDiff = parseInt(59);//倒计时总秒数量
    function timer(intDiff){
        var intervalid= window.setInterval(function(){
            var day=0,hour=0,minute=0,second=0;//时间默认值
            if(intDiff > 0){
                day = Math.floor(intDiff / (60 * 60 * 24));
                hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }
            // if (minute <= 9) minute = '0' + minute;
            // if (second <= 9) second = '0' + second;
            var allsec =  minute*60 + second;
            if (allsec <= 9) allsec = '0' + allsec;
            $('#sendCodeBtn').html(allsec+'秒后重发');
            intDiff--;
            if (intDiff <= 0){
                clearInterval(intervalid);
                $('#sendCodeBtn').html("获取验证码").removeClass("bg_gray");
                $('#sendCodeBtn').removeAttr("disabled");
            }
        },1000);
    }
    $(function(){
        timer(intDiff);
    });
}