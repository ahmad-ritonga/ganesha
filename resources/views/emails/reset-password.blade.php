<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Ganesha</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #374151;
            background: linear-gradient(135deg, #ecfdf5 0%, #cffafe 100%);
            padding: 20px;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #10b981 0%, #0891b2 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        }

        .logo {
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 1;
        }

        .logo svg {
            width: 40px;
            height: 40px;
            color: #10b981;
        }

        .header h1 {
            color: white;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }

        .header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            position: relative;
            z-index: 1;
        }

        .content {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
        }

        .message {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 30px;
            line-height: 1.8;
        }

        .button-container {
            text-align: center;
            margin: 40px 0;
        }

        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #0891b2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);
            transition: transform 0.2s ease;
        }

        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px -5px rgba(16, 185, 129, 0.5);
        }

        .warning-box {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
        }

        .warning-box h3 {
            color: #d97706;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .warning-box p {
            color: #92400e;
            font-size: 14px;
        }

        .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }

        .footer p {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 10px;
        }

        .social-links {
            margin-top: 20px;
        }

        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #10b981;
            text-decoration: none;
        }

        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 15px;
            }

            .header {
                padding: 30px 20px;
            }

            .content {
                padding: 30px 20px;
            }

            .header h1 {
                font-size: 24px;
            }

            .reset-button {
                padding: 14px 28px;
                font-size: 15px;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">
                <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            </div>
            <h1>Ganesha</h1>
            <p>Your Digital Library Platform</p>
        </div>

        <div class="content">
            <div class="greeting">Hello {{ $notifiable->name }}!</div>

            <div class="message">
                You are receiving this email because we received a password reset request for your account.
                To reset your password, please click the button below.
            </div>

            <div class="button-container">
                <a href="{{ $actionUrl }}" class="reset-button">Reset Password</a>
            </div>

            <div class="warning-box">
                <h3>⚠️ Important Security Information</h3>
                <p>This password reset link will expire in 60 minutes for your security. If you did not request a
                    password reset, please ignore this email and no changes will be made to your account.</p>
            </div>

            <div class="message">
                If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your
                web browser:
                <br><br>
                <a href="{{ $actionUrl }}" style="color: #10b981; word-break: break-all;">{{ $actionUrl }}</a>
            </div>
        </div>

        <div class="footer">
            <p><strong>Best regards,</strong><br>The Ganesha Team</p>
            <p>This is an automated message, please do not reply to this email.</p>

            <div class="social-links">
                <a href="#">Privacy Policy</a> |
                <a href="#">Terms of Service</a> |
                <a href="#">Contact Support</a>
            </div>
        </div>
    </div>
</body>

</html>
