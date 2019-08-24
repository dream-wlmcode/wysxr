$(function(){

    //初始化tab
    initTabContent();


    //获取cookie
    getCookie();
    //登录
    $("#signin").click(function(event) {
        var UserName = $("#UserName_l").val();
        var Password = $("#UserName_l").val();
        if($.trim(UserName).length == 0){
            art.dialog({
                content:"请输入用户名",
                cancel:false,
                fixed: true,
                lock: true,
                width: 210,
                ok:function(){}
            });
            return; 
        }

        if($.trim(Password).length == 0){
            art.dialog({
                content:"请输入密码",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok:function(){}
            });
            return; 
        }


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

        $.ajax({
            url: domainUrl + 'api/Users/Login',
            type: "POST",
            dataType: "json",
            data: {UserName: UserName, Password:Password},
            success:function (data) {
                if (data.code == 200) {
                    // alert(data.msg);
                    art.dialog({
                        content:data.msg,
                        cancel:false,
                        fixed: true,
                        lock: true,
                        dblclick_hide:false,
                        width: 200,
                        ok:function(){
                            window.location.href = "/index.html";
                        }
                    });
                    var token = data.token;
                    var inFifteenMinutes = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
                    $.cookie('token', '', { expires: -1 });
                    $.cookie('token', token, { expires: inFifteenMinutes});
                    setCookie();
                }else{
                    art.dialog({
                        content:data.msg,
                        cancel:false,
                        fixed: true,
                        lock: true,
                        width: 200,
                        ok:function(){}
                    });
                }
            },
            error: function(error) {
                alert(error);
            }
        });


    });



	//注册发送验证码
	$("#sendCodeBtn").click(function(event) {
		var Email = $("#Email").val();
		if(isEmail("Email",Email)){
            $(this).attr("disabled", "disabled").addClass("bg_gray");

            var isOK = false, json = null;
            $.ajax({
                type: 'post', 
                data: { Receiver: Email, RequstKey:"请求口令"},
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



    //条款和协议
    $("#Agreement").click(function(event) {
        $('#netProfilesModal').modal('show');
    });
    $('#netProfilesModal').on('hidden.bs.modal', function (e) {
        $('#netNoticeModal').modal('show');
    });




    //注册
    $("#register").click(function(event) {
        var Sex = $("#Sex").val();
        var Sex_text = $("#Sex option:selected").text();
        var UserName = $("#UserName").val();
        var Password = $("#Password").val();
        // var Phone = $("#Phone").val();
        var Email = $("#Email").val();
        var VerCode = $("#VerCode").val();
        var RequstKey = $("#RequstKey").val();

        if(Sex == 0){
            art.dialog({
                content:"请选择性别",
                cancel:false,
                fixed: true,
                lock: true,
                width: 210,
                ok:function(){}
            });
            return; 
        }


        if($.trim(UserName).length == 0){
            art.dialog({
                content:"请输入账号",
                cancel:false,
                fixed: true,
                lock: true,
                width: 210,
                ok:function(){}
            });
            return; 
        }

        if($.trim(Password).length == 0){
            art.dialog({
                content:"请输入密码",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok:function(){}
            });
            return; 
        }


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


        if($.trim(Email).length == 0){
            art.dialog({
                content:"请输入邮箱",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok:function(){}
            });
            return; 
        }



        if(!isEmail("Email",Email)){
            art.dialog({
                content:"邮箱输入不正确！",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok:function(){}
            });
            return; 
        }


        if($.trim(VerCode).length == 0){
            art.dialog({
                content:"请输入验证码",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok:function(){}
            });
            return; 
        }


        if(!$("#c2").prop("checked")){
            art.dialog({
                content:"请同意条款和协议",
                cancel:false,
                fixed: true,
                lock: true,
                width: 200,
                ok:function(){}
            });
            return; 
        }




        $.ajax({
            type: 'post', 
            data: {Sex:Sex_text,UserName:UserName, Password:Password, Email:Email, VerCode:VerCode, RequstKey:RequstKey},
            url: domainUrl+'api/Users/Reg',
            success: function (data) {
                if (data != "") {
                    if (data.ResultCode == 0){
                        console.log(data.Message);
                    }else if(data.ResultCode == 2){
                        console.log(data.Message);
                        art.dialog({
                            content:data.Message,
                            cancel:false,
                            fixed: true,
                            lock: true,
                            width: 200,
                            ok:function(){}
                        });
                    }
                }
            },
            error: function (xhr, type) {

            },
        });


    });
});



/*初始化tab*/
function initTabContent(){
    var id = getQueryString("id");
    if(id != undefined){
      // console.log(id);
      // console.log($("li[data-tab='tab-"+id+"]"));
      $("li[data-tab='tab-"+id+"']").addClass('current').siblings('li').removeClass('current');
      $('#tab-'+id).addClass('current').siblings('.sign_in_sec').removeClass('current');
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


/*设置cookie*/
function setCookie(){ 
    var UserName = $("#UserName_l").val();
    var Password = $("#Password_1").val();
    if($("#c1").is(":checked")){
        var inFifteenMinutes = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
        $.cookie('UserName', UserName, { expires: inFifteenMinutes});
        $.cookie('Password', Password, { expires: inFifteenMinutes});
    }else{
        $.cookie('UserName', null);
        $.cookie('Password', null);
        $("#UserName_1").val("");
        $("#Password_1").val("");
    }
}

/*获取cookie*/
function getCookie(){ 
    var UserName = $.cookie('UserName');
    var Password = $.cookie('Password');
    console.log("UserName:"+UserName);
    console.log("Password:"+Password);
    if(UserName != "null"){
        $("#UserName_l").val(UserName);
    }
    if(Password != "null"){
        $("#c1").attr("checked","true");
        $('#Password_1').attr("value",Password);
    }
    $("#c1").attr('checked',true); //复选框一直被选中
}