# ![Holer Server](http://blog.wdom.net/upload/2019/11/v3sonj7kuogp1orspp1ek7t4jt.png)

使用**holer服务端软件**搭建holer服务，通过holer客户端软件经**自己服务器**实现公网访问。<br/>
用户也可以下载 [**holer-server.zip**](https://github.com/wisdom-projects/holer-server/releases) 搭建自己的holer服务。<br/>
如果下载holer软件遇到问题，更多的下载地址详见[4.2节](#42-holer下载)。<br/>

![Holer Server](http://blog.wdom.net/upload/2019/04/pnlmngj08sh4eqv8fdb97oto0p.png)

## 1. 搭建holer服务端准备工作
(1) 准备一台可以经**公网IP访问**的Linux系统或者Windows系统主机；

(2) 安装**Java 1.8及以上版本**，执行命令 `java -version` 检查Java是否可用；

(3) 安装并启动Nginx, 建议安装其稳定版本；

(4) 安装MariaDB并**设置root用户密码**；

(5) 设置安全规则，允许访问holer服务端端口**6060、600**以及**端口映射规则**所涉及的端口；

(6) 建议申请域名并且完成域名备案，并设置域名**泛解析（*.域名）**和**直接解析主域名（@.域名）**，如果没有域名可以直接使用**IP和端口**访问。

## 2. 配置并启动holer服务端
解压软件包，打开配置文件 `holer-server/resources/application.yaml`

### 2.1 修改数据库用户名和密码

```
spring:
  datasource:
    username: root
    password: 123456
```

### 2.2 修改域名和Nginx主目录

```
holer
  domain:
    name: your-domain.com
  nginx:
    #home: /usr/local/nginx
    home: C:/nginx-1.14.2
```

将示例中的域名`your-domain.com`修改成自己**备案过**的域名，如果没有域名，请忽略该配置项。

Linux系统默认安装Nginx路径 `/usr/local/nginx` <br/>
Windows系统中可以先将Nginx复制到某个目录下，然后在配置文件中指定其主目录。<br/><br/>
**注意事项：** <br/>
请确保Nginx主目录下存在配置文件：`conf/nginx.conf` <br/>
Nginx目录结构示例：
```
Nginx主目录
├── conf
│   ├── nginx.conf
.   .
.   .
```

如果需要用到HTTPS功能，Window系统版本的Nginx默认支持HTTPS功能，Linux系统需要下载Nginx源码，配置和编译以及安装执行如下命令：
```
./configure --with-http_ssl_module
make;make install
```
### 2.3 启动holer服务端

Linux系统执行启动命令如下：
```
cd holer-server
chmod 755 holer
bash holer start
```
如果需要停止进程，执行命令`bash holer stop`<br/>

Windows系统执行启动命令如下：
```
cd holer-server
startup.bat
```
或者双击 `startup.bat`<br/>
如果需要停止进程，执行命令`shutdown.bat`或双击`shutdown.bat`<br/>

### 2.4 设置开机启动

进入目录：<br/>
`cd holer-server/bin`<br/>

**Windows系统**:<br/>
双击 `setup.vbs` <br/>
**注意事项：** <br/>
请确保当前用户对如下目录具有读取、写入、执行、修改等权限：<br/>
`C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp `<br/>

**Linux系统**:<br/>
执行命令 `bash setup.sh`<br/>
**注意事项：** <br/>
**CentOS 7, RedHat 7, Ubuntu 18** 及更高版本，建议执行命令`bash setup-service.sh`设置开机启动。<br/>

## 3. 创建端口映射

### 3.1 登录holer管理系统

如果配置文件`application.yaml`中设置了域名，并且指定了Nginx主目录，则在浏览器输入URL `http://holer.your-domain.com`
如果没有设置域名访问，则通过IP和端口登录系统 `http://IP地址:600`<br/>
![Holer Login](http://blog.wdom.net/upload/2019/04/oru7f1ojueilep57qkfkimrobf.png)

登录系统需要输入默认的管理员账号，默认用户名： `admin` 密码： `admin123`

用户也可以在文件`holer-server/resources/conf/holer-data.sql`中修改默认的用户名和密码，然后重启holer服务端使其生效。

### 3.2 创建客户端和端口映射

在用户列表页面中创建一个holer客户端<br/>
`http://holer.your-domain.com/view/holer-client.html`<br/>
![Holer Client](https://github.com/wisdom-projects/holer/blob/8d7794f500cfc2cc33702f92983d1674dab4917e/Image/holer-client.png)

在端口映射页面中为该holer客户端创建端口映射<br/>
`http://holer.your-domain.com/view/holer-port.html`<br/>
![Holer Port](https://github.com/wisdom-projects/holer/blob/8d7794f500cfc2cc33702f92983d1674dab4917e/Image/holer-port.png)

在数据统计页面中查看报表信息<br/>
`http://holer.your-domain.com/view/holer-report.html`<br/>
![Holer Report](https://github.com/wisdom-projects/holer/blob/8d7794f500cfc2cc33702f92983d1674dab4917e/Image/holer-report.png)

### 3.3 配置holer客户端使其与holer服务端实现端口映射功能

在用户列表页面中选中一条客户端记录，在页面右上角点击详情按钮，弹出的详情框下点击复制按钮；<br/>
![Holer Copy](http://blog.wdom.net/upload/2019/04/q7ffnsuu6ghf4p66chtb3001r3.png)

然后将详情信息粘贴到记事本里，请严格按照详情信息里的使用说明进行操作，这样可以顺利完成holer客户端配置，从而实现基于自己holer服务端的端口映射功能。

# 4. 支持与帮助

## 4.1 Holer使用示例
获得更多的holer使用示例，请参考[**官方文档**](http://blog.wdom.net)。

## 4.2 Holer下载
### 4.2.1 Holer客户端软件
[下载地址一](https://github.com/wisdom-projects/holer-client/releases)<br/>
[下载地址二](https://pan.baidu.com/s/1APDAaaaQxTa71IR2hDjIaA#list/path=%2Fsharelink2808252679-1014620033513253%2Fholer%2Fholer-client&parentPath=%2Fsharelink2808252679-1014620033513253)<br/>

### 4.2.2 Holer服务端软件
[下载地址一](https://github.com/wisdom-projects/holer-server/releases)<br/>
[下载地址二](https://pan.baidu.com/s/1APDAaaaQxTa71IR2hDjIaA#list/path=%2Fsharelink2808252679-1014620033513253%2Fholer%2Fholer-server&parentPath=%2Fsharelink2808252679-1014620033513253)<br/>

## 4.3 问题帮助
使用中遇到问题可以查看holer日志信息来排查问题的具体原因。

### 4.3.1 Holer客户端日志
#### 4.3.1.1 Java版本的holer客户端
查看日志文件：
`holer-client/logs/holer-client.log`

#### 4.3.1.2 Go版本的holer客户端
**Linux系统** <br/>
查看可执行程序所在目录下的日志文件`logs/holer-client.log`或者`nohup.out`文件。

**Windows系统** <br/>
查看可执行程序所在目录下的日志文件`logs/holer-client.log`

### 4.3.2 Holer服务端日志
查看日志文件：
`holer-server/logs/holer-server.log`

## 4.4 申请holer服务端软件license
Holer服务端软件是开源免费的，如果需要支持多个端口映射，可以申请相应规格的license。<br/>
Holer服务端软件license [**详见文档**](http://blog.wdom.net/article/23)
