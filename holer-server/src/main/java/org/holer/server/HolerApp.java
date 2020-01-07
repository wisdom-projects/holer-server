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

package org.holer.server;

import org.holer.server.constant.ServerConst;
import org.holer.server.container.ServerContainer;
import org.holer.server.util.ServerUtil;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

import lombok.extern.slf4j.Slf4j;

/** 
* @Class Name : HolerApp 
* @Description: Holer服务端应用 
* @Author     : Yudong (Dom) Wang 
* @Email      : wisdomtool@qq.com
* @Date       : 2018年12月17日 下午5:04:09 
* @Version    : Holer V1.1 
*/
@Slf4j
@EnableScheduling
@SpringBootApplication
public class HolerApp
{
    /**
    * @Title      : main 
    * @Description: Holer服务端主程序入口
    * @Param      : @param args 
    * @Return     : void
    * @Throws     : 
     */
    public static void main(String[] args)
    {
        ApplicationContext appCtx = SpringApplication.run(HolerApp.class, args);
        ServerUtil.setAppCtx(appCtx);
        String serverPort = ServerUtil.property(ServerConst.SERVER_PORT);
        log.info("Holer web server started on port " + serverPort);

        // Start container
        ServerContainer.getContainer().start();
    }

}
