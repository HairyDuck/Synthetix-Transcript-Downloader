<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Class Form1
    Inherits System.Windows.Forms.Form

    'Form overrides dispose to clean up the component list.
    <System.Diagnostics.DebuggerNonUserCode()> _
    Protected Overrides Sub Dispose(ByVal disposing As Boolean)
        Try
            If disposing AndAlso components IsNot Nothing Then
                components.Dispose()
            End If
        Finally
            MyBase.Dispose(disposing)
        End Try
    End Sub

    'Required by the Windows Form Designer
    Private components As System.ComponentModel.IContainer

    'NOTE: The following procedure is required by the Windows Form Designer
    'It can be modified using the Windows Form Designer.  
    'Do not modify it using the code editor.
    <System.Diagnostics.DebuggerStepThrough()> _
    Private Sub InitializeComponent()
        Me.Main = New System.Windows.Forms.TabControl()
        Me.TabPage1 = New System.Windows.Forms.TabPage()
        Me.rtbLog = New System.Windows.Forms.RichTextBox()
        Me.Label7 = New System.Windows.Forms.Label()
        Me.Label6 = New System.Windows.Forms.Label()
        Me.dtpEndDate = New System.Windows.Forms.DateTimePicker()
        Me.dtpStartDate = New System.Windows.Forms.DateTimePicker()
        Me.btnRunGetRequest = New System.Windows.Forms.Button()
        Me.TabPage2 = New System.Windows.Forms.TabPage()
        Me.btnSaveSettings = New System.Windows.Forms.Button()
        Me.Label5 = New System.Windows.Forms.Label()
        Me.lblUsername = New System.Windows.Forms.Label()
        Me.Label3 = New System.Windows.Forms.Label()
        Me.Label2 = New System.Windows.Forms.Label()
        Me.Label1 = New System.Windows.Forms.Label()
        Me.txtUsername = New System.Windows.Forms.TextBox()
        Me.txtPassword = New System.Windows.Forms.TextBox()
        Me.txtOutputPath = New System.Windows.Forms.TextBox()
        Me.txtConsumerKey = New System.Windows.Forms.TextBox()
        Me.txtApplicationKey = New System.Windows.Forms.TextBox()
        Me.PictureBox1 = New System.Windows.Forms.PictureBox()
        Me.Main.SuspendLayout()
        Me.TabPage1.SuspendLayout()
        Me.TabPage2.SuspendLayout()
        CType(Me.PictureBox1, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.SuspendLayout()
        '
        'Main
        '
        Me.Main.Controls.Add(Me.TabPage1)
        Me.Main.Controls.Add(Me.TabPage2)
        Me.Main.Dock = System.Windows.Forms.DockStyle.Fill
        Me.Main.Location = New System.Drawing.Point(0, 0)
        Me.Main.Name = "Main"
        Me.Main.SelectedIndex = 0
        Me.Main.Size = New System.Drawing.Size(482, 372)
        Me.Main.TabIndex = 8
        '
        'TabPage1
        '
        Me.TabPage1.Controls.Add(Me.PictureBox1)
        Me.TabPage1.Controls.Add(Me.rtbLog)
        Me.TabPage1.Controls.Add(Me.Label7)
        Me.TabPage1.Controls.Add(Me.Label6)
        Me.TabPage1.Controls.Add(Me.dtpEndDate)
        Me.TabPage1.Controls.Add(Me.dtpStartDate)
        Me.TabPage1.Controls.Add(Me.btnRunGetRequest)
        Me.TabPage1.Location = New System.Drawing.Point(4, 22)
        Me.TabPage1.Name = "TabPage1"
        Me.TabPage1.Padding = New System.Windows.Forms.Padding(3)
        Me.TabPage1.Size = New System.Drawing.Size(474, 346)
        Me.TabPage1.TabIndex = 0
        Me.TabPage1.Text = "Main"
        Me.TabPage1.UseVisualStyleBackColor = True
        '
        'rtbLog
        '
        Me.rtbLog.BackColor = System.Drawing.Color.Black
        Me.rtbLog.Dock = System.Windows.Forms.DockStyle.Bottom
        Me.rtbLog.ForeColor = System.Drawing.SystemColors.ButtonFace
        Me.rtbLog.Location = New System.Drawing.Point(3, 136)
        Me.rtbLog.Name = "rtbLog"
        Me.rtbLog.ReadOnly = True
        Me.rtbLog.Size = New System.Drawing.Size(468, 207)
        Me.rtbLog.TabIndex = 14
        Me.rtbLog.Text = ""
        '
        'Label7
        '
        Me.Label7.AutoSize = True
        Me.Label7.Location = New System.Drawing.Point(116, 89)
        Me.Label7.Name = "Label7"
        Me.Label7.Size = New System.Drawing.Size(52, 13)
        Me.Label7.TabIndex = 12
        Me.Label7.Text = "End Date"
        '
        'Label6
        '
        Me.Label6.AutoSize = True
        Me.Label6.Location = New System.Drawing.Point(116, 63)
        Me.Label6.Name = "Label6"
        Me.Label6.Size = New System.Drawing.Size(55, 13)
        Me.Label6.TabIndex = 13
        Me.Label6.Text = "Start Date"
        '
        'dtpEndDate
        '
        Me.dtpEndDate.Location = New System.Drawing.Point(177, 83)
        Me.dtpEndDate.Name = "dtpEndDate"
        Me.dtpEndDate.Size = New System.Drawing.Size(200, 20)
        Me.dtpEndDate.TabIndex = 11
        '
        'dtpStartDate
        '
        Me.dtpStartDate.Location = New System.Drawing.Point(177, 56)
        Me.dtpStartDate.Name = "dtpStartDate"
        Me.dtpStartDate.Size = New System.Drawing.Size(200, 20)
        Me.dtpStartDate.TabIndex = 10
        '
        'btnRunGetRequest
        '
        Me.btnRunGetRequest.Location = New System.Drawing.Point(178, 109)
        Me.btnRunGetRequest.Name = "btnRunGetRequest"
        Me.btnRunGetRequest.Size = New System.Drawing.Size(199, 23)
        Me.btnRunGetRequest.TabIndex = 8
        Me.btnRunGetRequest.Text = "Get Transcripts"
        Me.btnRunGetRequest.UseVisualStyleBackColor = True
        '
        'TabPage2
        '
        Me.TabPage2.Controls.Add(Me.btnSaveSettings)
        Me.TabPage2.Controls.Add(Me.Label5)
        Me.TabPage2.Controls.Add(Me.lblUsername)
        Me.TabPage2.Controls.Add(Me.Label3)
        Me.TabPage2.Controls.Add(Me.Label2)
        Me.TabPage2.Controls.Add(Me.Label1)
        Me.TabPage2.Controls.Add(Me.txtUsername)
        Me.TabPage2.Controls.Add(Me.txtPassword)
        Me.TabPage2.Controls.Add(Me.txtOutputPath)
        Me.TabPage2.Controls.Add(Me.txtConsumerKey)
        Me.TabPage2.Controls.Add(Me.txtApplicationKey)
        Me.TabPage2.Location = New System.Drawing.Point(4, 22)
        Me.TabPage2.Name = "TabPage2"
        Me.TabPage2.Padding = New System.Windows.Forms.Padding(3)
        Me.TabPage2.Size = New System.Drawing.Size(474, 346)
        Me.TabPage2.TabIndex = 1
        Me.TabPage2.Text = "Settings"
        Me.TabPage2.UseVisualStyleBackColor = True
        '
        'btnSaveSettings
        '
        Me.btnSaveSettings.Location = New System.Drawing.Point(116, 170)
        Me.btnSaveSettings.Name = "btnSaveSettings"
        Me.btnSaveSettings.Size = New System.Drawing.Size(301, 23)
        Me.btnSaveSettings.TabIndex = 36
        Me.btnSaveSettings.Text = "Save Settings"
        Me.btnSaveSettings.UseVisualStyleBackColor = True
        '
        'Label5
        '
        Me.Label5.AutoSize = True
        Me.Label5.Location = New System.Drawing.Point(57, 151)
        Me.Label5.Name = "Label5"
        Me.Label5.Size = New System.Drawing.Size(53, 13)
        Me.Label5.TabIndex = 31
        Me.Label5.Text = "Password"
        '
        'lblUsername
        '
        Me.lblUsername.AutoSize = True
        Me.lblUsername.Location = New System.Drawing.Point(57, 121)
        Me.lblUsername.Name = "lblUsername"
        Me.lblUsername.Size = New System.Drawing.Size(55, 13)
        Me.lblUsername.TabIndex = 32
        Me.lblUsername.Text = "Username"
        '
        'Label3
        '
        Me.Label3.AutoSize = True
        Me.Label3.Location = New System.Drawing.Point(46, 86)
        Me.Label3.Name = "Label3"
        Me.Label3.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Label3.Size = New System.Drawing.Size(64, 13)
        Me.Label3.TabIndex = 33
        Me.Label3.Text = "Output Path"
        '
        'Label2
        '
        Me.Label2.AutoSize = True
        Me.Label2.Location = New System.Drawing.Point(40, 60)
        Me.Label2.Name = "Label2"
        Me.Label2.Size = New System.Drawing.Size(75, 13)
        Me.Label2.TabIndex = 34
        Me.Label2.Text = "Consumer Key"
        '
        'Label1
        '
        Me.Label1.AutoSize = True
        Me.Label1.Location = New System.Drawing.Point(35, 38)
        Me.Label1.Name = "Label1"
        Me.Label1.Size = New System.Drawing.Size(80, 13)
        Me.Label1.TabIndex = 35
        Me.Label1.Text = "Application Key"
        '
        'txtUsername
        '
        Me.txtUsername.Location = New System.Drawing.Point(116, 118)
        Me.txtUsername.Name = "txtUsername"
        Me.txtUsername.Size = New System.Drawing.Size(301, 20)
        Me.txtUsername.TabIndex = 26
        '
        'txtPassword
        '
        Me.txtPassword.Location = New System.Drawing.Point(116, 144)
        Me.txtPassword.Name = "txtPassword"
        Me.txtPassword.PasswordChar = Global.Microsoft.VisualBasic.ChrW(42)
        Me.txtPassword.Size = New System.Drawing.Size(301, 20)
        Me.txtPassword.TabIndex = 27
        '
        'txtOutputPath
        '
        Me.txtOutputPath.Location = New System.Drawing.Point(116, 83)
        Me.txtOutputPath.Name = "txtOutputPath"
        Me.txtOutputPath.Size = New System.Drawing.Size(301, 20)
        Me.txtOutputPath.TabIndex = 28
        '
        'txtConsumerKey
        '
        Me.txtConsumerKey.Location = New System.Drawing.Point(116, 57)
        Me.txtConsumerKey.Name = "txtConsumerKey"
        Me.txtConsumerKey.Size = New System.Drawing.Size(301, 20)
        Me.txtConsumerKey.TabIndex = 29
        '
        'txtApplicationKey
        '
        Me.txtApplicationKey.Location = New System.Drawing.Point(116, 31)
        Me.txtApplicationKey.Name = "txtApplicationKey"
        Me.txtApplicationKey.Size = New System.Drawing.Size(301, 20)
        Me.txtApplicationKey.TabIndex = 30
        '
        'PictureBox1
        '
        Me.PictureBox1.Image = Global.Synthetix.My.Resources.Resources.Synthetix_Main
        Me.PictureBox1.Location = New System.Drawing.Point(97, 0)
        Me.PictureBox1.Name = "PictureBox1"
        Me.PictureBox1.Size = New System.Drawing.Size(303, 50)
        Me.PictureBox1.TabIndex = 15
        Me.PictureBox1.TabStop = False
        '
        'Form1
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(6.0!, 13.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(482, 372)
        Me.Controls.Add(Me.Main)
        Me.Name = "Form1"
        Me.Text = "Synthetix Transcript Downloader"
        Me.Main.ResumeLayout(False)
        Me.TabPage1.ResumeLayout(False)
        Me.TabPage1.PerformLayout()
        Me.TabPage2.ResumeLayout(False)
        Me.TabPage2.PerformLayout()
        CType(Me.PictureBox1, System.ComponentModel.ISupportInitialize).EndInit()
        Me.ResumeLayout(False)

    End Sub

    Friend WithEvents Main As TabControl
    Friend WithEvents TabPage1 As TabPage
    Friend WithEvents Label7 As Label
    Friend WithEvents Label6 As Label
    Friend WithEvents dtpEndDate As DateTimePicker
    Friend WithEvents dtpStartDate As DateTimePicker
    Friend WithEvents btnRunGetRequest As Button
    Friend WithEvents TabPage2 As TabPage
    Friend WithEvents btnSaveSettings As Button
    Friend WithEvents Label5 As Label
    Friend WithEvents lblUsername As Label
    Friend WithEvents Label3 As Label
    Friend WithEvents Label2 As Label
    Friend WithEvents Label1 As Label
    Friend WithEvents txtUsername As TextBox
    Friend WithEvents txtPassword As TextBox
    Friend WithEvents txtOutputPath As TextBox
    Friend WithEvents txtConsumerKey As TextBox
    Friend WithEvents txtApplicationKey As TextBox
    Public WithEvents rtbLog As RichTextBox
    Public WithEvents PictureBox1 As PictureBox
End Class
