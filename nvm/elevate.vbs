Set Shell = CreateObject("Shell.Application")
Set WShell = CreateObject("WScript.Shell")
Set Env = WShell.Environment("PROCESS")

cmd = Env("CMD")
app = Env("APP")

If cmd = "" Or app = "" Then
  WScript.Echo "Error: CMD or APP environment variable is missing"
  WScript.Quit 1
End If

If Left(cmd, Len(app)) <> app Then
  WScript.Echo "Error: CMD does not start with APP"
  WScript.Quit 1
End If

args = Mid(cmd, Len(app) + 1)

If WScript.Arguments.Count > 0 Then
  Shell.ShellExecute app, args, "", "runas", 0
End If
