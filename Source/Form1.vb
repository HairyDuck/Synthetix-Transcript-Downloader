Imports System.IO
Imports System.Net.Http
Imports Newtonsoft.Json

Public Class Form1
    Private httpClient As HttpClient
    Private settings As Settings

    Private Sub Form1_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        dtpStartDate.Value = DateTime.Now.AddDays(-7)
        dtpEndDate.Value = DateTime.Now

        ' Load settings
        settings = LoadSettings()
        txtApplicationKey.Text = settings.ApplicationKey
        txtConsumerKey.Text = settings.ConsumerKey
        txtUsername.Text = settings.Username
        txtPassword.Text = settings.Password
        txtOutputPath.Text = settings.OutputPath
    End Sub

    Private Sub btnSaveSettings_Click(sender As Object, e As EventArgs) Handles btnSaveSettings.Click
        settings.ApplicationKey = txtApplicationKey.Text.Trim()
        settings.ConsumerKey = txtConsumerKey.Text.Trim()
        settings.Username = txtUsername.Text.Trim()
        settings.Password = txtPassword.Text.Trim()
        settings.OutputPath = txtOutputPath.Text.Trim()

        SaveSettings(settings)
        MessageBox.Show("Settings saved.")
    End Sub

    Private Async Sub btnRunGetRequest_Click(sender As Object, e As EventArgs) Handles btnRunGetRequest.Click
        If httpClient Is Nothing Then
            ' Log in
            httpClient = New HttpClient()
            httpClient.DefaultRequestHeaders.Add("APPLICATIONKEY", settings.ApplicationKey)
            httpClient.DefaultRequestHeaders.Add("CONSUMERKEY", settings.ConsumerKey)

            Dim request As New HttpRequestMessage(HttpMethod.Post, "https://apidev.synthetix.com/2.0/internal/profile")
            Dim formData As New Dictionary(Of String, String) From {
            {"usrname", settings.Username},
            {"passwd", settings.Password}
        }
            request.Content = New FormUrlEncodedContent(formData)

            Dim response As HttpResponseMessage = Await httpClient.SendAsync(request)
            Dim jsonResponse As String = Await response.Content.ReadAsStringAsync()

            If response.IsSuccessStatusCode Then
                Dim responseObject = JsonConvert.DeserializeObject(Of Dictionary(Of String, Object))(jsonResponse)
                If responseObject.ContainsKey("token") Then
                    httpClient.DefaultRequestHeaders.Authorization = New Net.Http.Headers.AuthenticationHeaderValue("Bearer", responseObject("token").ToString())
                    rtbLog.AppendText("Logged in successfully." & Environment.NewLine)
                Else
                    MessageBox.Show("Error logging in: token not found.")
                End If
            Else
                rtbLog.AppendText($"Error logging in.{Environment.NewLine}Response: {jsonResponse}{Environment.NewLine}")
            End If
        End If

        ' Get transcripts
        rtbLog.AppendText("Fetching chat IDs..." & Environment.NewLine)
        Dim startDate As String = dtpStartDate.Value.ToString("yyyy-MM-dd")
        Dim endDate As String = dtpEndDate.Value.ToString("yyyy-MM-dd")
        Dim requestTranscripts As New HttpRequestMessage(HttpMethod.Get, $"https://apidev.synthetix.com/2.0/internal/chatids?startdate={startDate}&enddate={endDate}")
        DisplayDebugWindow(requestTranscripts)

        Dim responseTranscripts As HttpResponseMessage = Await httpClient.SendAsync(requestTranscripts)
        Dim jsonResponseTranscripts As String = Await responseTranscripts.Content.ReadAsStringAsync()

        If responseTranscripts.IsSuccessStatusCode Then
            Dim chatIds As List(Of String) = JsonConvert.DeserializeObject(Of List(Of String))(jsonResponseTranscripts)

            ' Display chat IDs in the log window
            ' rtbLog.AppendText($"Retrieved {chatIds.Count} {Environment.NewLine}")

            ' Get details and save transcripts
            Dim result = Await GetDetailsAndSave(chatIds)

            ' Show result in output window
            rtbLog.AppendText($"Saved {result.Count} chats.{Environment.NewLine}{Environment.NewLine}")

            ' Automatically scroll to the bottom of the log window
            rtbLog.SelectionStart = rtbLog.TextLength
            rtbLog.ScrollToCaret()
        End If
    End Sub


    Private Async Function GetDetailsAndSave(chatIds As List(Of String)) As Task(Of (Count As Integer, ChatIds As List(Of String)))
        Dim savedCount As Integer = 0
        Dim savedChatIds As New List(Of String)
        ' Show chat IDs before starting to download
        rtbLog.AppendText($"Retrieving details for {chatIds.Count} chats...{Environment.NewLine}")

        For Each chatId As String In chatIds
            rtbLog.AppendText($"Saving -> {chatId}{Environment.NewLine}")

            Dim request As New HttpRequestMessage(HttpMethod.Post, "https://apidev.synthetix.com/2.0/livechat/details")
            Dim formData As New Dictionary(Of String, String) From {
    {"uniQref", chatId}
}
            request.Content = New FormUrlEncodedContent(formData)

            Dim response As HttpResponseMessage = Await httpClient.SendAsync(request)

            If response.IsSuccessStatusCode Then
                Dim jsonResponse As String = Await response.Content.ReadAsStringAsync()
                File.WriteAllText(Path.Combine(settings.OutputPath, $"{chatId}.json"), jsonResponse)
                savedCount += 1
                savedChatIds.Add(chatId)
            End If
        Next

        Return (savedCount, savedChatIds)
    End Function

    Private Function LoadSettings() As Settings
        Dim path As String = "settings.json"
        If File.Exists(path) Then
            Dim json As String = File.ReadAllText(path)
            Return JsonConvert.DeserializeObject(Of Settings)(json)
        Else
            Return New Settings()
        End If
    End Function

    Private Sub SaveSettings(settings As Settings)
        Dim path As String = "settings.json"
        Dim json As String = JsonConvert.SerializeObject(settings)
        File.WriteAllText(path, json)
    End Sub

    Private Sub DisplayDebugWindow(request As HttpRequestMessage)
        ' Show request in output window
        'rtbLog.AppendText($"Request Method: {request.Method}{Environment.NewLine}Request URI: {request.RequestUri}{Environment.NewLine}Headers:{Environment.NewLine}{String.Join(Environment.NewLine, request.Headers)}{Environment.NewLine}")
        ' Automatically scroll to the bottom of the log window
        rtbLog.SelectionStart = rtbLog.TextLength
        rtbLog.ScrollToCaret()
    End Sub

    Private Sub rtbLog_TextChanged(sender As Object, e As EventArgs) Handles rtbLog.TextChanged
        ' Automatically scroll to the bottom of the log window
        rtbLog.SelectionStart = rtbLog.TextLength
        rtbLog.ScrollToCaret()
    End Sub

End Class

Public Class Settings
    Public Property ApplicationKey As String
    Public Property ConsumerKey As String
    Public Property Username As String
    Public Property Password As String
    Public Property OutputPath As String
    Public Sub New()
        ApplicationKey = ""
        ConsumerKey = ""
        Username = ""
        Password = ""
        OutputPath = ""
    End Sub
End Class