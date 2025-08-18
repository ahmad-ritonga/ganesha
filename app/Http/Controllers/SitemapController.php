<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
    {
        $books = Book::where('is_published', true)
            ->select('id', 'slug', 'updated_at')
            ->get();

        $categories = Category::where('is_active', true)
            ->select('id', 'slug', 'updated_at')
            ->get();

        $content = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $content .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        // Home page
        $content .= $this->addUrl(url('/'), now(), 'daily', '1.0');

        // Books
        foreach ($books as $book) {
            $content .= $this->addUrl(
                url('/books/' . $book->slug),
                $book->updated_at,
                'weekly',
                '0.8'
            );
        }

        // Categories
        foreach ($categories as $category) {
            $content .= $this->addUrl(
                url('/categories/' . $category->slug),
                $category->updated_at,
                'weekly',
                '0.7'
            );
        }

        // Static pages
        $content .= $this->addUrl(url('/books'), now(), 'daily', '0.9');
        $content .= $this->addUrl(url('/categories'), now(), 'weekly', '0.8');

        $content .= '</urlset>';

        return response($content, 200)
            ->header('Content-Type', 'application/xml');
    }

    private function addUrl($loc, $lastmod, $changefreq, $priority)
    {
        return sprintf(
            "  <url>\n    <loc>%s</loc>\n    <lastmod>%s</lastmod>\n    <changefreq>%s</changefreq>\n    <priority>%s</priority>\n  </url>\n",
            htmlspecialchars($loc),
            $lastmod->format('Y-m-d'),
            $changefreq,
            $priority
        );
    }
}
