<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }} - Ganesha Deployment</title>
    <meta name="robots" content="noindex, nofollow">
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .content {
            padding: 30px;
        }

        .step {
            background: #f8f9fa;
            border-left: 4px solid #10b981;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }

        .success {
            border-left-color: #10b981;
            background: #d1fae5;
            color: #065f46;
        }

        .error {
            border-left-color: #ef4444;
            background: #fee2e2;
            color: #dc2626;
        }

        .warning {
            border-left-color: #f59e0b;
            background: #fef3c7;
            color: #92400e;
        }

        .info {
            border-left-color: #3b82f6;
            background: #dbeafe;
            color: #1e40af;
        }

        .button {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 10px 5px;
            transition: transform 0.2s;
        }

        .button:hover {
            transform: translateY(-2px);
            color: white;
            text-decoration: none;
        }

        .button-blue {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .button-orange {
            background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .form-group {
            margin: 20px 0;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #374151;
        }

        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 16px;
            box-sizing: border-box;
        }

        .form-group input:focus {
            border-color: #10b981;
            outline: none;
        }

        pre {
            background: #1f2937;
            color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'Consolas', 'Monaco', monospace;
        }

        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }

        .status-card {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }

        .status-ok {
            background: #d1fae5;
            color: #065f46;
        }

        .status-error {
            background: #fee2e2;
            color: #dc2626;
        }

        h1,
        h2,
        h3 {
            margin-top: 0;
        }

        ul,
        ol {
            padding-left: 20px;
        }

        a {
            color: #3b82f6;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .navigation {
            background: #f8f9fa;
            padding: 15px 30px;
            border-bottom: 1px solid #e5e7eb;
        }

        .nav-links {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        .nav-links a {
            padding: 8px 16px;
            background: #6b7280;
            color: white;
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
        }

        .nav-links a:hover {
            background: #4b5563;
            text-decoration: none;
        }

        @media (max-width: 768px) {
            .container {
                margin: 10px;
                border-radius: 10px;
            }

            .header {
                padding: 20px;
            }

            .content {
                padding: 20px;
            }

            .status-grid {
                grid-template-columns: 1fr;
            }

            .nav-links {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>🎯 {{ $title }}</h1>
            <p>Ganesha Institute Deployment Center</p>
        </div>

        <div class="navigation">
            <div class="nav-links">
                <a href="/deploy/status?key=ganesha2024deploy">📊 Status</a>
                <a href="/deploy/extract-assets?key=ganesha2024deploy">📦 Extract Assets</a>
                <a href="/deploy/recaptcha-setup?key=ganesha2024deploy">🔒 reCAPTCHA</a>
                <a href="/">🌐 Homepage</a>
                <a href="/login">🧪 Test Login</a>
            </div>
        </div>

        <div class="content">
            {!! $content() !!}

            <div class="step info">
                <h3>🔗 Quick Links</h3>
                <p>Access these deployment tools:</p>
                <a href="/deploy/status?key=ganesha2024deploy" class="button button-blue">📊 Check Status</a>
                <a href="/deploy/extract-assets?key=ganesha2024deploy" class="button">📦 Extract Assets</a>
                <a href="/deploy/recaptcha-setup?key=ganesha2024deploy" class="button">🔒 Setup reCAPTCHA</a>
                <a href="/" class="button">🌐 Visit Site</a>
            </div>
        </div>
    </div>
</body>

</html>
