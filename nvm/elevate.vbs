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

cmdT = Trim(cmd)
appL = LCase(Trim(app))

' Extract executable and arguments from CMD (quote-safe)
If Left(cmdT, 1) = """" Then
  exeEnd = InStr(2, cmdT, """")
  If exeEnd = 0 Then
    WScript.Echo "Error: Malformed quoted CMD"
    WScript.Quit 1
  End If
  exe = Mid(cmdT, 2, exeEnd - 2)
  args = Trim(Mid(cmdT, exeEnd + 1))
Else
  exeEnd = InStr(cmdT, " ")
  If exeEnd = 0 Then
    exe = cmdT
    args = ""
  Else
    exe = Left(cmdT, exeEnd - 1)
    args = Trim(Mid(cmdT, exeEnd + 1))
  End If
End If

' Validate executable match
If LCase(exe) <> appL Then
  WScript.Echo "Error: CMD executable does not match APP"
  WScript.Quit 1
End If

' Secure whitelist (basename-based)
exeName = LCase(Mid(exe, InStrRev(exe, "\") + 1))
Set FSO = CreateObject("Scripting.FileSystemObject")

Select Case exeName
  Case "node.exe", "npm.exe"
    ' Require full path and existence (prevents PATH hijack)
    If InStr(exe, "\") = 0 Or Not FSO.FileExists(exe) Then
      WScript.Echo "Error: APP must be a full path to a trusted executable"
      WScript.Quit 1
    End If

  Case "cmd.exe"
    ' Allowed (system-resolved)

  Case Else
    WScript.Echo "Error: Untrusted executable"
    WScript.Quit 1
End Select

' Execute with elevation and error handling (no WScript.Arguments gate)
On Error Resume Next
Shell.ShellExecute exe, args, "", "runas", 0

If Err.Number <> 0 Then
  WScript.Echo "Error: Elevation failed (" & Err.Description & ")"
  WScript.Quit 1
End If

On Error GoTo 0
WScript.Quit 0
