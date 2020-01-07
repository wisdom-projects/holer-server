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

var accessKey;
var clientIndex;
var clientList;

var portId;
var portIndex;
var portList;

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
* FUNCTION NAME  : isValidDomain 
* DESCRIPTION    : 校验域名是否有效 
* ARGUMENTS      : domain - 域名
* RETURN         : boolean
 */
function isValidDomain(domain) {
    var rule = /^[0-9a-zA-Z.-\s]+$/
    return rule.test(domain);
}

/*
* FUNCTION NAME  : isValidServer 
* DESCRIPTION    : 校验内网地址是否有效 
* ARGUMENTS      : localServer - 内网地址
* RETURN         : boolean
 */
function isValidServer(localServer) {
    var rule = /^[0-9a-zA-Z.:-]+$/
    return rule.test(localServer);
}

/*
* FUNCTION NAME  : getParam 
* DESCRIPTION    : 获取URL参数值
* ARGUMENTS      : name - 参数名称
* RETURN         : 参数值
 */
function getParamValue(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    if(result != null) {
        return  unescape(result[2]);
    }
    return "";
}

/*
* FUNCTION NAME  : portTable 
* DESCRIPTION    : 生成端口列表 
* ARGUMENTS      : ports - 端口映射规则数据
* RETURN         : void
 */
function portTable(ports) {
    var publicAddr = '';
    var portStatus = '';
    var switchId = '';
    var checked = '';

    var $portTable = $("#port-list");
    $portTable.empty();

    if(ports.length <= 0) {
        return;
    }

    $.each(ports, function(i, port) {
        publicAddr = port["portNum"];
        if(port["domain"] != null && port["domain"] != "") {
            publicAddr += "/" + port["domain"];
        }

        if(port["validDay"] <= 0) {
            portStatus = "<span class='badge bg-red'>过期</span>";
        } else if(!port["enabled"]) {
            portStatus = "<span class='badge bg-light'>关闭</span>";
        } else {
            portStatus = "<span class='badge bg-green'>正常</span>";
        }

        if (port["enabled"]) {
            checked = "checked=''";
        } else {
            checked = "";
        }

        switchId = "switch-" + i;
        $portTable.append("<tr> <td> <input type='radio' name='port-radio' id='radio-" + i + "' value='" + i + "' /> </td>"
        + "<td>" + publicAddr + "</td>"
        + "<td>" + port["server"] + "</td>"
        + "<td>" + port["type"] + "</td>"
        + "<td>" + port["validDay"] + "</td>"
        + "<td>" + portStatus + "</td>"
        + "<td><div class='onoffswitch'> <input type='checkbox' name='client-switch' class='onoffswitch-checkbox' id='" + switchId + "' value='" + i + "' " + checked + " onclick='enable(this)'/>"
        + "<label class='onoffswitch-label' for='" + switchId + "'> <span class='onoffswitch-inner'></span> <span class='onoffswitch-switch'></span> </label> </div></td> </tr>");
    });
}

/*
* FUNCTION NAME  : clientSelect 
* DESCRIPTION    : 生成客户端下拉列表 
* ARGUMENTS      : clients - 客户端数据
* RETURN         : void
 */
function clientSelect(clients) {
    if(clients.length <= 0) {
        return;
    }

    var $clientSelect = $("#client-list");
    $.each(clients, function(i, client) {
        $clientSelect.append("<option value='" + i + "'>" + client["name"] + "</option>");
    });

    var clientIndex = 0;
    var accessKey = getParamValue("accessKey");
    if("" != accessKey) {
        $("#search-user").val(accessKey);
        clientIndex = getIndexByKey(accessKey);
        if(clientIndex == -1) {
            clientIndex = 0;
        }
    }

    $("#client-list option[value='" + clientIndex + "']").attr("selected", true);
    var client = clients[clientIndex];
    portTable(client["ports"])
}

/*
* FUNCTION NAME  : changeClient 
* DESCRIPTION    : 更改客户端包含的端口映射信息 
* ARGUMENTS      : void
* RETURN         : void
 */
function changeClient() {
    clientIndex = $("#client-list").val();
    var client = clientList[clientIndex];
    portTable(client["ports"])
}

/*
* FUNCTION NAME  : initDetail 
* DESCRIPTION    : 初始化查询端口详情 
* ARGUMENTS      : void
* RETURN         : void
 */
function initDetail()
{
    var msgId = "#msg-port-detail";
    show("", msgId);
    $("#btn-detail-port").removeAttr("data-dismiss");

    portIndex = $("input[name='port-radio']:checked").val();
    if(portIndex == undefined){
        portId = -1;
        $("#port-detail").val("");
        show("请先选择需要查询的端口映射", msgId);
        return;
    }

    var line = "---------------------------------------------";
    clientIndex = $("#client-list").val();
    var client = clientList[clientIndex];
    accessKey = client.accessKey;

    portList = client.ports;
    var port = portList[portIndex];
    portId = port.portId;

    var clientDetail = line;
    clientDetail += "\nHoler Client : " + client.name;
    clientDetail += "\nAccess Key : " + accessKey;

    var time = (port.expireAt - new Date().getTime())/(24 * 3600 * 1000);
    if(time < 0)
    {
        time = 0;
    }

    clientDetail += "\n" + line;
    var date = new Date(port.expireAt);
    if(port.domain != null && port.domain != "")
    {
        clientDetail += "\nDomain Name : " + port.domain;
    }

    clientDetail += "\nInternet Address : " + port.inetAddr;
    clientDetail += "\nLocal Address : " + port.server;
    clientDetail += "\nExpire at : " + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    clientDetail += "\nThe holer port is expiring in " + time.toFixed(1) + " days";

    clientDetail += "\n" + line;
    $("#port-detail").val(clientDetail);
}

/*
* FUNCTION NAME  : copyDetail 
* DESCRIPTION    : 复制端口详情 
* ARGUMENTS      : void
* RETURN         : void
 */
function copyDetail()
{
    $("#port-detail").select();
    document.execCommand("Copy");
}

/*
* FUNCTION NAME  : initAdd 
* DESCRIPTION    : 初始添加端口映射规则
* ARGUMENTS      : void
* RETURN         : void
 */
function initAdd()
{
    var msgId = "#msg-port-new";
    show("", msgId);
    $("#btn-add-port").removeAttr("data-dismiss");

    clientIndex = $("#client-list").val();
    var client = clientList[clientIndex];
    accessKey = client["accessKey"];
    portList = client["ports"];

    $("#new-client").val(client["name"]);
    $("#new-port").val("65");
    $("#new-domain").val("");
    $("#new-local-server").val("127.0.0.1:8080");
    $("#new-type").val("HTTP");
    $("#new-valid-day").val("");
}

/*
* FUNCTION NAME  : addPort 
* DESCRIPTION    : 添加端口映射规则
* ARGUMENTS      : void
* RETURN         : void
 */
function addPort()
{
    var msgId = "#msg-port-new";
    var port = $("#new-port").val();
    var domain = $("#new-domain").val();
    var localServer = $("#new-local-server").val();
    var type = $("#new-type").val();
    var validDay = $("#new-valid-day").val();

    if (port == "") {
        show("请输入公网端口", msgId);
        return;
    }
    if (port < 1 || port > 65535) {
        show("端口号不正确，正确的端口范围1-65535", msgId);
        return;
    }
    if (domain != "" && !isValidDomain(domain)) {
        show("域名无效", msgId);
        return;
    }
    if (localServer == "") {
        show("请输入内网地址", msgId);
        return;
    }
    if (!isValidServer(localServer)) {
        show("内网地址无效", msgId);
        return;
    }
    if (validDay != "" && (validDay < 0 || validDay > 1000)) {
        show("支持的有效期范围0-1000天", msgId);
        return;
    }
    if (validDay == "") {
        validDay = 10;
    }

    $.ajax( {
        url: '/api/port/' + accessKey,
        type: 'POST',
        contentType: jsonType,
        dataType: 'json',
        cache: false,
        async: false,
        beforeSend: function(hdr) {
            hdr.setRequestHeader(tokenKey, token);
        },
        data: JSON.stringify({
            'portNum': Number(port), 
            'server': localServer,
            'domain': domain,
            'type': type,
            'validDay': Number(validDay),
            'enabled': true
        }),
        success: function(rep) {
            if(rep.code == 1000) {
                // 添加端口记录
                portList.push(rep.data);
                portTable(portList);
                $("#btn-add-port").attr("data-dismiss","modal");
            } else if(rep.code == 1007){
                window.location.href='/login.html';
            } else {
                show(rep.msg, msgId);
            }
        },
        error: function(req, status, error) {
            show("添加端口映射失败：" + error, msgId);
        }
    });
}

/*
* FUNCTION NAME  : initUpdate 
* DESCRIPTION    : 初始更新端口映射规则 
* ARGUMENTS      : void
* RETURN         : void
 */
function initUpdate()
{
    var msgId = "#msg-port-update";
    show("", msgId);
    $("#btn-update-port").removeAttr("data-dismiss");

    portIndex = $("input[name='port-radio']:checked").val();
    if(portIndex == undefined){
        portId = -1;
        $("#update-port").val("");
        $("#update-domain").val("");
        $("#update-local-server").val("");
        $("#update-type").val("");
        $("#update-valid-day").val("");
        show("请先选择需要修改的端口映射", msgId);
        return;
    }

    var clientIndex = $("#client-list").val();
    var client = clientList[clientIndex];
    accessKey = client["accessKey"];

    portList = client["ports"];
    var port = portList[portIndex];
    portId = port["portId"];

    $("#update-client").val(client["name"]);
    $("#update-port").val(port["portNum"]);
    $("#update-domain").val(port["domain"]);
    $("#update-local-server").val(port["server"]);
    $("#update-type").val(port["type"]);
    $("#update-valid-day").val(port["validDay"]);
}

/*
* FUNCTION NAME  : updatePort 
* DESCRIPTION    : 更新端口映射规则
* ARGUMENTS      : void
* RETURN         : void
 */
function updatePort()
{
    var msgId = "#msg-port-update";
    if(portId == -1){
        show("请先选择需要修改的端口映射", msgId);
        return;
    }

    var port = $("#update-port").val();
    var domain = $("#update-domain").val();
    var localServer = $("#update-local-server").val();
    var type = $("#update-type").val();
    var validDay = $("#update-valid-day").val();

    if (port == "") {
        show("请输入公网端口", msgId);
        return;
    }
    if (port < 1 || port > 65535) {
        show("端口号不正确，正确的端口范围1-65535", msgId);
        return;
    }
    if (domain != "" && !isValidDomain(domain)) {
        show("域名无效", msgId);
        return;
    }
    if (localServer == "") {
        show("请输入内网地址", msgId);
        return;
    }
    if (!isValidServer(localServer)) {
        show("内网地址无效", msgId);
        return;
    }
    if (validDay == "") {
        show("请输入有效期", msgId);
        return;
    }
    if (validDay < 0 || validDay > 1000) {
        show("支持的有效期范围0-1000天", msgId);
        return;
    }

    $.ajax( {
        url: '/api/port',
        type: 'PUT',
        contentType: jsonType,
        dataType: 'json',
        cache: false,
        async: false,
        beforeSend: function(hdr) {
            hdr.setRequestHeader(tokenKey, token);
        },
        data: JSON.stringify({
            'portId': portId,
            'portNum': Number(port), 
            'server': localServer,
            'domain': domain,
            'type': type,
            'validDay': Number(validDay)
        }),
        success: function(rep) {
            if(rep.code == 1000) {
                // 更新端口记录
                portList[portIndex] = rep.data;
                portTable(portList);
                $("#btn-update-port").attr("data-dismiss","modal");
            } else if(rep.code == 1007){
                window.location.href='/login.html';
            } else {
                show(rep.msg, msgId);
            }
        },
        error: function(req, status, error) {
            show("更新端口映射失败：" + error, msgId);
        }
    });
}

/*
* FUNCTION NAME  : initDelete 
* DESCRIPTION    : 初始删除端口映射规则 
* ARGUMENTS      : void
* RETURN         : void
 */
function initDelete()
{
    var msgId = "#msg-port-delete";
    show("确定要删除该端口映射？", msgId);
    $("#btn-delete-port").removeAttr("data-dismiss");

    portIndex = $("input[name='port-radio']:checked").val();
    if(portIndex == undefined){
        portId = -1;
        show("请先选择需要删除的端口映射", msgId);
        return;
    }

    clientIndex = $("#client-list").val();
    var client = clientList[clientIndex];
    accessKey = client["accessKey"];

    portList = client["ports"];
    var port = portList[portIndex];
    portId = port["portId"];
}

/*
* FUNCTION NAME  : deletePort 
* DESCRIPTION    : 删除端口映射规则
* ARGUMENTS      : void
* RETURN         : void
 */
function deletePort()
{
    var msgId = "#msg-port-delete";
    if(portId == -1){
        show("请先选择需要删除的端口映射", msgId);
        return;
    }

    $.ajax( {  
        url: '/api/port/' + portId,
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
                // 删除端口记录
                portList.splice(portIndex, 1);
                portTable(portList);
                $("#btn-delete-port").attr("data-dismiss","modal");
            } else if(rep.code == 1007){
                window.location.href='/login.html';
            } else {
                show(rep.msg, msgId);
            }
        },
        error: function(req, status, error) {
            show("删除端口映射失败：" + error, msgId);
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
    var msgId = "#msg-port-list";
    $("#search-user").val("");

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
                clientSelect(rep.data);
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
* FUNCTION NAME  : getIndexByKey 
* DESCRIPTION    : 根据秘钥查询客户端索引 
* ARGUMENTS      : key - 秘钥
* RETURN         : void
 */
function getIndexByKey(key)
{
    var index = -1;
    if(clientList.length <= 0) {
        return index;
    }

    for (var i = 0; i < clientList.length; i++) {
        if(key == clientList[i].accessKey) {
            index = i;
            break;
        }
    }

    return index;
}

/*
* FUNCTION NAME  : getClientByKey 
* DESCRIPTION    : 根据秘钥查询客户端信息 
* ARGUMENTS      : void
* RETURN         : void
 */
function getClientByKey()
{
    var msgId = "#msg-port-list";
    var key = $("#search-user").val();

    if(null == key || key == "") {
        return;
    }

    $.ajax( {  
        url: '/api/client/key/' + key,
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
                var client = rep.data;

                var clientIndex = getIndexByKey(key);
                if(clientIndex == -1) {
                    return;
                }

                $("#client-list option[value='" + clientIndex + "']").attr("selected", true);
                portTable(client.ports);
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
* DESCRIPTION    : 启用或者禁用端口 
* ARGUMENTS      : onoffswitch - 启用或禁用开关
* RETURN         : void
 */
function enable(onoffswitch) {

    var msgId = "#msg-port-list";
    var enabled = $(onoffswitch).is(':checked');
    portIndex = $(onoffswitch).attr("value");

    var clientIndex = $("#client-list").val();
    var client = clientList[clientIndex];

    portList = client["ports"];
    var port = portList[portIndex];

    $.ajax( {
        url: '/api/port',
        type: 'PUT',
        contentType: jsonType,
        dataType: 'json',
        cache: false,
        async: false,
        beforeSend: function(hdr) {
            hdr.setRequestHeader(tokenKey, token);
        },
        data: JSON.stringify({ 
            'portId': port["portId"],
            'enabled': enabled
        }),
        success: function(rep) {
            if(rep.code == 1000) {
                portList[portIndex] = rep.data;
                portTable(portList);
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