' Copyright 2018-present, Yudong (Dom) Wang
'
' Licensed under the Apache License, Version 2.0 (the "License");
' you may not use this file except in compliance with the License.
' You may obtain a copy of the License at
'
'      http://www.apache.org/licenses/LICENSE-2.0
'
' Unless required by applicable law or agreed to in writing, software
' distributed under the License is distributed on an "AS IS" BASIS,
' WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
' See the License for the specific language governing permissions and
' limitations under the License.

'---------------------------------------------------
' SETUP.VBS
'---------------------------------------------------
Dim HOLER_FSO
Dim HOLER_WSH
Dim HOLER_ENV
Dim HOLER_HOME
Dim HOLER_VBS_FILE
Dim HOLER_BOOT_DIR

Set HOLER_FSO = CreateObject("Scripting.FileSystemObject")
Set HOLER_WSH = CreateObject("WScript.Shell")
Set HOLER_ENV = HOLER_WSH.Environment("USER")

HOLER_VBS_FILE = "holer.vbs"
HOLER_BOOT_DIR = "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp\"
HOLER_HOME = HOLER_FSO.GetFolder("..\").Path & "\"

'---------------------------------------------------
' Set HOLER ENV
'---------------------------------------------------
HOLER_ENV("HOLER_HOME") = HOLER_HOME

'---------------------------------------------------
' Set startup
'---------------------------------------------------
HOLER_FSO.CopyFile HOLER_VBS_FILE, HOLER_BOOT_DIR

MsgBox("Done")
WScript.Quit
