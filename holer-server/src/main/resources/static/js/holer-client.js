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

var clientId;
var clientIndex;
var clientList;

var tokenKey = 'HOLER-AUTH-TOKEN';
var jsonType = 'application/json; charset=utf-8';
var token = $.cookie(tokenKey);

/*页面加载初始化客户端列表*/
$(getClients);

/*
* FUNCTION NAME  : show 
* DESCRIPTION    : 打印结果信息 
* ARGUMENTS      : msg - 消息，msgId - 信息打印的位置
* RETURN         : void
 */
function show(msg, msgId) {
    $(msgId).text(msg).css("color", "red").show();
}

/*
* FUNCTION NAME  : isValidKey 
* DESCRIPTION    : 校验秘钥是否有效 
* ARGUMENTS      : key - 访问秘钥
* RETURN         : boolean
 */
function isValidKey(key) {
    var rule = /^[0-9a-zA-Z_-]+$/
    return rule.test(key);
}

/*
* FUNCTION NAME  : isValidName 
* DESCRIPTION    : 校验用户名是否有效 
* ARGUMENTS      : name - 用户名
* RETURN         : boolean
 */
function isValidName(name) {
    var rule = /^[0-9a-zA-Z.@_-]+$/
    return rule.test(name);
}

/*
* FUNCTION NAME  : clientTable 
* DESCRIPTION    : 生成客户端列表 
* ARGUMENTS      : clients - 客户端数据
* RETURN         : void
 */
function clientTable(clients) {
    var statCol = "";
    var portCol = "";
    var switchId = "";
    var checked = "";
    var accessKey = ""; 

    var $clientTable = $("#client-list");
    $clientTable.empty();

    if(clients.length <= 0) {
        return;
    }

    $.each(clients, function(i, client) {
        portCol = "";
        $.each(client["ports"], function(j, port) {
            portCol += port["portNum"] + "↔" + port["server"].split(':')[1] + " ";
        });

        if (client["status"] != 0) {
            statCol = "<span class='badge bg-green'>在线</span>";
        } else {
            statCol = "<span class='badge bg-light'>离线</span>";
        }
        if (client["enabled"]) {
            checked = "checked=''";
        } else {
            checked = "";
        }

        accessKey = client["accessKey"];
        switchId = "switch-" + i;
        $clientTable.append("<tr> <td> <input type='radio' name='client-radio' id='radio-" + i + "' value='" + i + "' /> </td>"
        + "<td>" + client["name"] + "</td>"
        + "<td><a href='holer-port.html?accessKey=" + accessKey + "'>" + accessKey + "</td>"
        + "<td>" + portCol + "</td>"
        + "<td>" + statCol + "</td>"
        + "<td><div class='onoffswitch'> <input type='checkbox' name='client-switch' class='onoffswitch-checkbox' id='" + switchId + "' value='" + i + "' " + checked + " onclick='enable(this)'/>"
        + "<label class='onoffswitch-label' for='" + switchId + "'> <span class='onoffswitch-inner'></span> <span class='onoffswitch-switch'></span> </label> </div></td> </tr>");
    });
}

/*
* FUNCTION NAME  : initDetail 
* DESCRIPTION    : 初始化查询客户端详情 
* ARGUMENTS      : void
* RETURN         : void
 */
function initDetail()
{
    var msgId = "#msg-client-detail";
    show("", msgId);
    $("#btn-detail-client").removeAttr("data-dismiss");

    clientIndex = $("input[name='client-radio']:checked").val();
    if(clientIndex == undefined){
        clientId = -1;
        $("#client-detail").val("");
        show("请先选择需要查询的用户记录", msgId);
        return;
    }

    var line = "---------------------------------------------";
    var client = clientList[clientIndex];
    clientId = client.clientId;

    var clientDetail = line;
    clientDetail += "\nHoler Client : " + client.name;
    clientDetail += "\nAccess Key : " + client.accessKey;
    
    var ports = client.ports;
    for(var i = 0; i < ports.length; i++) {
        var time = (ports[i].expireAt - new Date().getTime())/(24 * 3600 * 1000);
        if(time < 0)
        {
            time = 0;
        }

        clientDetail += "\n" + line;
        var date = new Date(ports[i].expireAt);
        if(ports[i].domain != null && ports[i].domain != "")
        {
            clientDetail += "\nDomain Name : " + ports[i].domain;
        }

        clientDetail += "\nInternet Address : " + ports[i].inetAddr;
        clientDetail += "\nLocal Address : " + ports[i].server;
        clientDetail += "\nExpire at : " + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        clientDetail += "\nThe holer port is expiring in " + time.toFixed(1) + " days";
    }

    var serverHost = '';
    if(ports.length > 0) {
        serverHost = ports[0].inetAddr.split(':')[0];
    }

    clientDetail += "\n" + line;
    clientDetail += "\n\n1. 使用说明";
    clientDetail += "\n\n  Holer有Java和Go两种版本，选择其中一种版本使用即可。";
    clientDetail += "\n\n  1.1 Java版本holer";
    clientDetail += "\n\n  使用前先安装Java，下载软件包holer-client.zip\n  修改配置文件holer-client/conf/holer.conf，添加配置项如下：\n  HOLER_ACCESS_KEY=" + client.accessKey + "\n  HOLER_SERVER_HOST=" + serverHost;
    clientDetail += "\n\n  启动holer，打开终端进入目录holer-client/bin执行如下命令：\n  Windows系统: startup.bat\n  Linux系统: bash startup.sh";
    clientDetail += "\n\n  1.2 Go版本holer";
    clientDetail += "\n\n  在不同的系统中使用方法类似，以常用的Windows和Linux x86 64位系统为例；\n  下载软件包holer-windows.tar.gz和holer-linux-x86.tar.gz\n  打开终端进入可执行程序所在的目录，启动holer执行命令如下：";
    clientDetail += "\n\n  Windows系统:\n  holer-windows-amd64.exe -k " + client.accessKey + " -s " + serverHost;
    clientDetail += "\n\n  Linux系统:\n  nohup ./holer-linux-amd64 -k " + client.accessKey + " -s " + serverHost + " &";
    clientDetail += "\n\n  1.3 访问映射后的应用";
    clientDetail += "\n\n  访问前先确定Local Address对应的本地应用是否可以正常访问；\n  使用列表中的Internet Address访问映射后的应用；\n  如果是WEB应用还可以直接通过Domain Name访问。";
    clientDetail += "\n\n" + line;
    clientDetail += "\n\n2. 相关资料";
    clientDetail += "\n\n  2.1 软件地址\n  https://github.com/wisdom-projects/holer/tree/master/Binary";
    clientDetail += "\n\n  2.2 问题帮助\n  使用中遇到问题可以查看日志文件和终端打印的日志信息来排查问题的具体原因；\n  Java版本的日志文件路径：holer-client/logs\n  Go Linux版本查看可执行程序所在目录下的nohup.out文件";
    clientDetail += "\n\n  2.3 参考文档\n  http://blog.wdom.net/category/Holer";
    clientDetail += "\n\n" + line;
    $("#client-detail").val(clientDetail);
}

/*
* FUNCTION NAME  : copyDetail 
* DESCRIPTION    : 复制客户端详情 
* ARGUMENTS      : void
* RETURN         : void
 */
function copyDetail()
{
    $("#client-detail").select();
    document.execCommand("Copy");
}

/*
* FUNCTION NAME  : initAdd 
* DESCRIPTION    : 初始化添加客户端
* ARGUMENTS      : void
* RETURN         : void
 */
function initAdd()
{
    var msgId = "#msg-client-new";
    show("", msgId);
    $("#btn-add-client").removeAttr("data-dismiss");

    $("#new-client-name").val("");
    $("#new-client-key").val("");
}

/*
* FUNCTION NAME  : addClient 
* DESCRIPTION    : 添加客户端 
* ARGUMENTS      : void
* RETURN         : void
 */
function addClient()
{
    var msgId = "#msg-client-new";
    var clientName = $("#new-client-name").val();
    var clientKey = $("#new-client-key").val();
    if (clientName == "") {
        show("请输入用户名称", msgId);
        return;
    }
    if (clientName.length < 6) {
        show("用户名称最小长度不少于6个字符", msgId);
        return;
    }
    if (clientName.length > 64) {
        show("用户名称最大长度不超过64个字符", msgId);
        return;
    }
    if (!isValidName(clientName)) {
        show("用户名称无效，请使用正确的邮箱作为用户名", msgId);
        return;
    }
    if (clientKey != "") {
        if (clientKey.length < 16) {
            show("秘钥最小长度不少于16个字符", msgId);
            return;
        }
        if (clientKey.length > 64) {
            show("秘钥最大长度不超过64个字符", msgId);
            return;
        }
        if (!isValidKey(clientKey)) {
            show("秘钥只能含有字母、数字、下划线、中划线", msgId);
            return;
        }
    }

    $.ajax( {
        url: '/api/client',
        type: 'POST',
        contentType: jsonType,
        dataType: 'json',
        cache: false,
        async: false,
        beforeSend: function(hdr) {
            hdr.setRequestHeader(tokenKey, token);
        },
        data: JSON.stringify({ 
            'name': clientName, 
            'accessKey': clientKey,
            'enabled': true,
            'status': 0
        }),
        success: function(rep) {
            if(rep.code == 1000) {
                // 添加客户端记录
                clientList.push(rep.data);
                clientTable(clientList);
                $("#btn-add-client").attr("data-dismiss","modal");
            } else if(rep.code == 1007){
            	window.location.href='/login.html';
            } else {
                show(rep.msg, msgId);
            }
        },
        error: function(req, status, error) {
            show("添加用户失败：" + error, msgId);
        }
    });
}

/*
* FUNCTION NAME  : initUpdate 
* DESCRIPTION    : 初始化更新客户端 
* ARGUMENTS      : void
* RETURN         : void
 */
function initUpdate()
{
    var msgId = "#msg-client-update";
    show("", msgId);
    $("#btn-update-client").removeAttr("data-dismiss");

    clientIndex = $("input[name='client-radio']:checked").val();
    if(clientIndex == undefined){
        clientId = -1;
        $("#update-client-name").val("");
        $("#update-client-key").val("");
        show("请先选择需要修改的用户记录", msgId);
        return;
    }

    var client = clientList[clientIndex];
    clientId = client["clientId"];
    $("#update-client-name").val(client["name"]);
    $("#update-client-key").val(client["accessKey"]);
}

/*
* FUNCTION NAME  : updateClient 
* DESCRIPTION    : 修改客户端 
* ARGUMENTS      : void
* RETURN         : void
 */
function updateClient()
{
    var msgId = "#msg-client-update";
    if(clientId == -1){
        $("#update-client-name").val("");
        $("#update-client-key").val("");
        show("请先选择需要修改的用户记录", msgId);
        return;
    }

    var clientName = $("#update-client-name").val();
    var clientKey = $("#update-client-key").val();
    if (clientName == "") {
        show("请输入用户名称", msgId);
        return;
    }
    if (clientName.length < 6) {
        show("用户名称最小长度不少于6个字符", msgId);
        return;
    }
    if (clientName.length > 64) {
        show("用户名称最大长度不超过64个字符", msgId);
        return;
    }
    if (!isValidName(clientName)) {
        show("用户名称无效，请使用正确的邮箱作为用户名", msgId);
        return;
    }
    if (clientKey == "") {
        show("请输入秘钥", msgId);
        return;
    }
    if (clientKey.length < 16) {
        show("秘钥最小长度不少于16个字符", msgId);
        return;
    }
    if (clientKey.length > 64) {
        show("秘钥最大长度不超过64个字符", msgId);
        return;
    }
    if (!isValidKey(clientKey)) {
        show("秘钥只能含有字母、数字、下划线、中划线", msgId);
        return;
    }

    $.ajax( {
        url: '/api/client',
        type: 'PUT',
        contentType: jsonType,
        dataType: 'json',
        cache: false,
        async: false,
        beforeSend: function(hdr) {
            hdr.setRequestHeader(tokenKey, token);
        },
        data: JSON.stringify({ 
            'clientId': clientId,
            'name': clientName, 
            'accessKey': clientKey
        }),
        success: function(rep) {
            if(rep.code == 1000) {
                // 更新客户端记录
            	var portList = clientList[clientIndex].ports;
                clientList[clientIndex] = rep.data;
                clientList[clientIndex].ports = portList;
                clientTable(clientList);
                $("#btn-update-client").attr("data-dismiss","modal");
            } else if(rep.code == 1007){
            	window.location.href='/login.html';
            } else {
                show(rep.msg, msgId);
            }
        },
        error: function(req, status, error) {
            show("更新用户失败：" + error, msgId);
        }
    });
}

/*
* FUNCTION NAME  : initDelete 
* DESCRIPTION    : 初始化删除客户端 
* ARGUMENTS      : void
* RETURN         : void
 */
function initDelete()
{
    var msgId = "#msg-client-delete";
    show("确定要删除该用户？", msgId);
    $("#btn-delete-client").removeAttr("data-dismiss");

    clientIndex = $("input[name='client-radio']:checked").val();
    if(clientIndex == undefined){
        clientId = -1;
        show("请先选择需要删除的用户记录", msgId);
        return;
    }

    var client = clientList[clientIndex];
    clientId = client["clientId"];
}

/*
* FUNCTION NAME  : deleteClient 
* DESCRIPTION    : 删除客户端信息 
* ARGUMENTS      : void
* RETURN         : void
 */
function deleteClient()
{
    if(clientId == -1){
        show("请先选择需要删除的用户记录", msgId);
        return;
    }

    var msgId = "#msg-client-delete";
    $.ajax( {  
        url: '/api/client/' + clientId,
        data: {},
        type: 'DELETE',  
        cache: false,
        contentType: jsonType,
        dataType: 'json',
        async: false,
        beforeSend: function(hdr) {
            hdr.setRequestHeader(tokenKey, token);
        },
        success: function(rep) {
            if(rep.code == 1000) {
                // 删除客户端记录
                clientList.splice(clientIndex, 1);
                clientTable(clientList);
                $("#btn-delete-client").attr("data-dismiss","modal");
            } else if(rep.code == 1007){
            	window.location.href='/login.html';
            } else {
                show(rep.msg, msgId);
            }
        },
        error: function(req, status, error) {
            show("删除用户失败：" + error, msgId);
        }
    });
}

/*
* FUNCTION NAME  : getClients 
* DESCRIPTION    : 查询全部客户端信息 
* ARGUMENTS      : void
* RETURN         : void
 */
function getClients()
{
    var msgId = "#msg-client-list";
    $.ajax( {  
        url: '/api/client/all',
        type: 'GET',
        contentType: jsonType,
        dataType: 'json',
        cache: false,
        async: false,
        beforeSend: function(hdr) {
            hdr.setRequestHeader(tokenKey, token);
        },
        data: {},
        success: function(rep) {
            if(rep.code == 1000) {
                clientList = rep.data;
                clientTable(rep.data);
            } else if(rep.code == 1007){
            	window.location.href='/login.html';
            } else {
                show(rep.msg, msgId);
            }
        },
        error: function(req, status, error) {
            show("查询用户失败：" + error, msgId);
        }
    });
}

/*
* FUNCTION NAME  : enable 
* DESCRIPTION    : 启用或者禁用客户端 
* ARGUMENTS      : onoffswitch - 启用或禁用开关
* RETURN         : void
 */
function enable(onoffswitch) {

    var msgId = "#msg-client-list";
    var enabled = $(onoffswitch).is(':checked');
    clientIndex = $(onoffswitch).attr("value");
    var client = clientList[clientIndex];

    $.ajax( {
        url: '/api/client',
        type: 'PUT',
        contentType: jsonType,
        dataType: 'json',
        cache: false,
        async: false,
        beforeSend: function(hdr) {
            hdr.setRequestHeader(tokenKey, token);
        },
        data: JSON.stringify({ 
            'clientId': client["clientId"],
            'name': client["name"], 
            'enabled': enabled
        }),
        success: function(rep) {
            if(rep.code == 1000) {
                /* 设置成功，忽略消息 */
                client["enabled"] = enabled;
            } else if(rep.code == 1007){
            	window.location.href='/login.html';
            } else {
                show(rep.msg, msgId);
            }
        },
        error: function(req, status, error) {
            show("启用或禁用用户失败：" + error, msgId);
        }
    });
}
