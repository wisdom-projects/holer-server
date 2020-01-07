/*
 * Copyright 2018-present, Yudong (Dom) Wang
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

$(function () {
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' /* optional */
    });
});

$("input").focus(function(){
    $("#feedback").text("欢迎访问您的HOLER").css("color","black").show();
});

/*
* FUNCTION NAME  : show 
* DESCRIPTION    : 打印结果信息 
* ARGUMENTS      : msg - 消息
* RETURN         : void
 */
function show(msg) {
    $("#feedback").text(msg).css("color","red").show();
}

/*
* FUNCTION NAME  : login 
* DESCRIPTION    : 系统登录 
* ARGUMENTS      : void
* RETURN         : void
 */
function login() {
    var name = $("#username").val();
    var passwd = $("#password").val();
    if (name == "") {
        show("请输入用户名");
        return;
    }
    if (name.length < 3) {
        show("用户名最小长度不少于3个字符");
        return;
    }
    if (name.length > 64) {
        show("用户名最大长度不超过64个字符");
        return;
    }
    if (passwd == "") {
        show("请输入密码");
        return;
    }
    if (passwd.length < 6) {
        show("密码最小长度不少于6个字符");
        return;
    }
    if (passwd.length > 64) {
        show("密码最大长度不超过64个字符");
        return;
    }
    // 认证用户名和密码
    $.ajax({  
        url: '/user/login',
        type: 'POST',
        contentType: 'application/json', 
        dataType: 'json',
        cache: false,
        async: false,
        data: JSON.stringify({ 
            'name': name, 
            'password': passwd 
        }),
        success: function(rep) {
            if(rep.code == 1000) {
                show("认证成功");
                $.cookie('HOLER-AUTH-TOKEN', rep.data.token, {expires: 7, path: '/'});
                window.location.href='/view/holer-report.html';
            } else {
                show(rep.msg);
            }
        },
        error: function(req, status, error) {
            show("认证失败：" + error);
        }
    });
}

$(document).keydown(function (event) {
    if (event.keyCode == 13) {
        login();
    }
});
