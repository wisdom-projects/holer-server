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

var report;
var tokenKey = 'HOLER-AUTH-TOKEN';
var jsonType = 'application/json; charset=utf-8';
var token = $.cookie(tokenKey);

/*
* FUNCTION NAME  : show 
* DESCRIPTION    : 打印结果信息 
* ARGUMENTS      : msg - 消息
* RETURN         : void
 */
function show(msg) {
    $("#msg-report").text(msg).css("color", "red").show();
}

/*
* FUNCTION NAME  : bytesToSize 
* DESCRIPTION    : byte转为size
* ARGUMENTS      : bytes - 字节数
* RETURN         : void
 */
function bytesToSize(bytes) {
    if (bytes == 0) {
        return '0 B';
    }

    var k = 1024;
    var sizes = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];
    var i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

/*
* FUNCTION NAME  : getReport 
* DESCRIPTION    : 查询报表信息 
* ARGUMENTS      : void
* RETURN         : void
 */
function getReport()
{
    var msgId = "#msg-report";
    $.ajax( {
        url: '/api/client/report',
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
                report = rep.data;
            } else if(rep.code == 1007){
            	window.location.href='/login.html';
            } else {
                show(rep.msg);
            }
        },
        error: function(req, status, error) {
            show("查询报表失败：" + error);
        }
    });
}

$(function () {
    "use strict";

    // 查询报表信息 
    getReport();

    // 用户状态
    var userStatDonut = new Morris.Donut({
        element: 'user-stat-chart',
        resize: true,
        colors: ["#dd4b39", "#00c0ef", "#b2b6be", "#00a65a"],
        data: [
            {label: "禁用的用户数量", value: report["disabledClient"]},
            {label: "启用的用户数量", value: report["enabledClient"]},
            {label: "离线的用户数量", value: report["offlineClient"]},
            {label: "在线的用户数量", value: report["onlineClient"]}
        ],
        hideHover: 'auto'
    });

    // 端口状态
    var portEnabledDonut = new Morris.Donut({
        element: 'port-stat-chart',
        resize: true,
        colors: ["#dd4b39", "#00c0ef", "#f39c12", "#3c8dbc", "#b2b6be", "#00a65a"],
        data: [
            {label: "关闭的端口数量", value: report["downPort"]},
            {label: "开启的端口数量", value: report["upPort"]},
            {label: "已过期端口数量", value: report["expiredPort"]},
            {label: "未过期端口数量", value: report["unexpiredPort"]},
            {label: "未运行端口数量", value: report["inactivePort"]},
            {label: "运行中端口数量", value: report["activePort"]},
        ],
        hideHover: 'auto'
    });

    // 应用分类
    var appTypeDonut = new Morris.Donut({
        element: 'app-type-chart',
        resize: true,
        colors: ["#b2b6be", "#f56954", "#f39c12", "#3c8dbc", "#00c0ef", "#00a65a"],
        data: [
            {label: "其他TCP应用数量", value: report["appType"]["TCP"]},
            {label: "远程桌面应用数量", value: report["appType"]["RDESKTOP"]},
            {label: "SSH 应用数量", value: report["appType"]["SSH"]},
            {label: "数据库应用数量", value: report["appType"]["DATABASE"]},
            {label: "HTTPS应用数量", value: report["appType"]["HTTPS"]},
            {label: "HTTP 应用数量", value: report["appType"]["HTTP"]}
        ],
        hideHover: 'auto'
    });

    // 拼接连接和流量数据
    var traffic = [];
    var connections = [];
    $.each(report["traffic"], function(i, data) {
        if(data["channels"] > 0) {
            connections.push({y: data["port"], a: data["channels"]});
        }
        if(data["readBytes"] > 0 || data["wroteBytes"] > 0) {
            traffic.push({y: data["port"], a: data["readBytes"], b: data["wroteBytes"]});
        }
    });

    // 连接数量
    var connectionBar = new Morris.Bar({
        element: 'connection-chart',
        resize: true,
        data: connections,
        barColors: ['#00a65a'],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['连接数'],
        hideHover: 'auto'
    });

    // 流量统计
    var trafficStatBar = new Morris.Bar({
        element: 'traffic-stat-chart',
        resize: true,
        data: traffic,
        barColors: ['#00a65a', '#00c0ef'],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['流入', '流出'],
        hideHover: 'auto'
    });
});
