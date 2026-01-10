Set Shell = CreateObject("Shell.Application")
Set WShell = WScript.CreateObject("WScript.Shell")
Set ProcEnv = WShell.Environment("PROCESS")

cmd = ProcEnv("CMD")
app = ProcEnv("APP")

' Validate that CMD starts with APP before extracting arguments
If Left(cmd, Len(app)) = app Then
  args = Mid(cmd, Len(app) + 1)
Else
  WScript.Echo "Error: CMD does not start with APP"
  WScript.Quit 1
End If

If WScript.Arguments.Count >= 1 Then
  Shell.ShellExecute app, args, "", "runas", 0
Else
  WScript.Quit
End If

