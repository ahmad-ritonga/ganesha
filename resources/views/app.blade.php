<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Security Headers --}}
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    <meta name="referrer" content="strict-origin-when-cross-origin">

    {{-- SEO Meta Tags --}}
    <meta name="description"
        content="Platform perpustakaan digital Ganesha untuk membaca dan mengelola koleksi e-book berkualitas. Akses ribuan buku digital dengan mudah dan praktis.">
    <meta name="keywords"
        content="perpustakaan digital, e-book, buku online, membaca digital, koleksi buku, ganesha library">
    <meta name="author" content="Ganesha Digital Library">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#4f46e5">

    {{-- Open Graph / Facebook --}}
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title"
        content="{{ isset($page['props']['title']) ? $page['props']['title'] . ' - ' . config('app.name') : config('app.name') . ' - Platform Perpustakaan Digital' }}">
    <meta property="og:description"
        content="Platform perpustakaan digital Ganesha untuk membaca dan mengelola koleksi e-book berkualitas. Akses ribuan buku digital dengan mudah dan praktis.">
    <meta property="og:image" content="{{ asset('assets/images/logo.png') }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="{{ config('app.name') }}">
    <meta property="og:locale" content="id_ID">

    {{-- Twitter --}}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{{ url()->current() }}">
    <meta name="twitter:title"
        content="{{ isset($page['props']['title']) ? $page['props']['title'] . ' - ' . config('app.name') : config('app.name') . ' - Platform Perpustakaan Digital' }}">
    <meta name="twitter:description"
        content="Platform perpustakaan digital Ganesha untuk membaca dan mengelola koleksi e-book berkualitas. Akses ribuan buku digital dengan mudah dan praktis.">
    <meta name="twitter:image" content="{{ asset('assets/images/logo.png') }}">

    {{-- Canonical URL --}}
    <link rel="canonical" href="{{ url()->current() }}">

    {{-- DNS Prefetch --}}
    <link rel="dns-prefetch" href="//fonts.bunny.net">

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';
            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    {{-- Page Title --}}
    <title inertia>
        {{ isset($page['props']['title']) ? $page['props']['title'] . ' - ' . config('app.name') : config('app.name') . ' - Platform Perpustakaan Digital' }}
    </title>

    {{-- Simplified Favicons - Only Essential Ones --}}
    <link rel="icon" href="{{ asset('assets/images/logo.png') }}" type="image/png" sizes="32x32">
    <link rel="apple-touch-icon" href="{{ asset('assets/images/logo.png') }}">

    {{-- Web App Manifest --}}
    <link rel="manifest" href="{{ asset('site.webmanifest') }}">

    {{-- Essential PWA meta tags --}}
    <meta name="application-name" content="{{ config('app.name') }}">
    <meta name="apple-mobile-web-app-title" content="{{ config('app.name') }}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="msapplication-TileColor" content="#4f46e5">

    {{-- Preconnect to external domains --}}
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead

    {{-- Structured Data --}}
    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "{{ config('app.name') }}",
            "description": "Platform perpustakaan digital Ganesha untuk membaca dan mengelola koleksi e-book berkualitas. Akses ribuan buku digital dengan mudah dan praktis.",
            "url": "{{ url('/') }}",
            "logo": "{{ asset('assets/images/logo.png') }}",
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "{{ url('/') }}/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            }
        }
        </script>
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
