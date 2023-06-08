<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Class DebugWindow
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
        Me.txtRequest = New System.Windows.Forms.RichTextBox()
        Me.SuspendLayout()
        '
        'txtRequest
        '
        Me.txtRequest.Dock = System.Windows.Forms.DockStyle.Fill
        Me.txtRequest.Location = New System.Drawing.Point(0, 0)
        Me.txtRequest.Name = "txtRequest"
        Me.txtRequest.Size = New System.Drawing.Size(800, 450)
        Me.txtRequest.TabIndex = 0
        Me.txtRequest.Text = ""
        '
        'DebugWindow
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(6.0!, 13.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(800, 450)
        Me.Controls.Add(Me.txtRequest)
        Me.Name = "DebugWindow"
        Me.Text = "DebugWindow"
        Me.ResumeLayout(False)

    End Sub

    Friend WithEvents txtRequest As RichTextBox
End Class
