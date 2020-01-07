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

var tokenKey = 'HOLER-AUTH-TOKEN';

/*
* FUNCTION NAME  : logout 
* DESCRIPTION    : 系统注销 
* ARGUMENTS      : void
* RETURN         : void
 */
function logout()
{
    $.ajax({  
        url: '/user/logout',
        type: 'GET',
        contentType: 'application/json', 
        dataType: 'json',
        cache: false,
        async: false,
        data: {},
        success: function(rep) {
            $.cookie(tokenKey, '', {expires: -1, path: '/'});
            window.location.href = '/login.html';
        },
        error: function() { 
            $.cookie(tokenKey, '', {expires: -1, path: '/'});
            window.location.href = '/login.html';
        }
    });
}
