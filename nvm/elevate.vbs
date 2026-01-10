Set Shell = CreateObject("Shell.Application")
Set WShell = CreateObject("WScript.Shell")
Set Env = WShell.Environment("PROCESS")

cmd = Env("CMD")
app = Env("APP")

' Validate environment variables
If cmd = "" Or app = "" Then
  WScript.Echo "Error: CMD or APP environment variable is missing"
  WScript.Quit 1
End If

' Normalize case (Windows is case-insensitive)
cmdL = LCase(Trim(cmd))
appL = LCase(Trim(app))

' Validate command format and extract arguments safely
If cmdL = appL Then
  args = ""
ElseIf Left(cmdL, Len(appL) + 1) = appL & " " Then
  args = Mid(cmd, Len(app) + 2)
Else
  WScript.Echo "Error: CMD does not match APP executable"
  WScript.Quit 1
End If

' Whitelist trusted executables
Select Case appL
  Case "node.exe", "npm.exe", "cmd.exe"
    ' allowed
  Case Else
    WScript.Echo "Error: Untrusted APP executable"
    WScript.Quit 1
End Select

' Execute with elevation and error handling
If WScript.Arguments.Count > 0 Then
  On Error Resume Next

  Shell.ShellExecute app, args, "", "runas", 0

  If Err.Number <> 0 Then
    WScript.Echo "Error: Elevation failed (" & Err.Description & ")"
    WScript.Quit 1
  End If

  On Error GoTo 0
End If
