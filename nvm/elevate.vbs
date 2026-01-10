Set Shell = CreateObject("Shell.Application")
Set WShell = CreateObject("WScript.Shell")
Set Env = WShell.Environment("PROCESS")

cmd = Env("CMD")
app = Env("APP")

If cmd = "" Or app = "" Then
  WScript.Echo "Error: CMD or APP environment variable is missing"
  WScript.Quit 1
End If

cmdL = LCase(Trim(cmd))
appL = LCase(Trim(app))

If cmdL = appL Then
  args = ""
ElseIf Left(cmdL, Len(appL) + 1) = appL & " " Then
  args = Mid(cmd, Len(app) + 2)
Else
  WScript.Echo "Error: CMD does not match APP executable"
  WScript.Quit 1
End If

Select Case appL
  Case "node.exe", "npm.exe", "cmd.exe"
    ' allowed
  Case Else
    WScript.Echo "Error: Untrusted APP executable"
    WScript.Quit 1
End Select

If WScript.Arguments.Count > 0 Then
  Shell.ShellExecute app, args, "", "runas", 0
End If
