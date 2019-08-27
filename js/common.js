var Key = $.cookie('Key');
var State = $.cookie('State');
var UserName = $.cookie('UserName');
$(function(){
    //顶部导航
    if(Key != undefined){
        $("#enterd").hide();
        $("#user-account").show();

        //获取小头像
        $.ajax({
            url: domainUrl + 'api/UserInfo/GetAvatarSmall',
            type: "POST",
            dataType: "json",
            data: {RequstKey: Key,},
            success:function (data) {
                if (data.ResultCode == 0) {
                    
                }else{
                    art.dialog({
                        content:data.Message,
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
        $("#user-account").find("a.userName").text(UserName);



        $("#logout").click(function(event) {
            $.cookie('Key', '', { expires: -1 });
            $.cookie('State', '', { expires: -1 });
            $.cookie('UserName', '', { expires: -1 });
            window.location.href="/sign-in.html?id=1";
        });
    }else{
        $("#enterd").show();
        $("#user-account").hide();
    }






});
/*获取参数*/
function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = decodeURI(window.location.search).substr(1).match(reg); 
    if (r != null){
        return unescape(r[2]); 
        return null; 
    }
}

/*验证邮箱格式*/
function isEmail(obj,val){
	 if($.trim(val).length==""){
	    art.dialog({
            content:"请输入邮箱",
            cancel:false,
            fixed: true,
            lock: true,
            width: 200,
            ok:function(){}
        });
	    $("#"+obj).focus();
	    return false; 
	 }
	 var pattern= /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	 strEmail=pattern.test(val);
	 if (strEmail){ 
	   return true;
	 }else{
	    art.dialog({
            content:"邮箱格式不正确！",
            cancel:false,
            fixed: true,
            lock: true,
            width: 200,
            ok:function(){}
        });
	 }
}



/*校验密码：只能输入6-20个字母、数字、下划线*/
function isPasswd(val){  
    var patrn=/^(\w){6,20}$/;  
    if (!patrn.exec(val)){
        return false;
    }
    return true;
}