import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  BarChart3,
  Calendar,
  Activity
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const breadcrumbs = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
  },
  {
    title: 'Reading Progress',
    href: '/admin/analytics/reading-progress',
  },
];

interface ReadingProgressAnalytics {
  overview: {
    total_reading_progress: number;
    completed_readings: number;
    completion_rate: number;
    average_progress: number;
    active_readers: number;
    average_reading_speed: number;
  };
  daily_progress: Array<{
    date: string;
    new_readings: number;
    completions: number;
  }>;
  progress_distribution: {
    [key: string]: number;
  };
  top_books: Array<{
    id: string;
    title: string;
    author: string;
    total_readings: number;
    completed_readings: number;
    completion_rate: number;
    average_progress: number;
  }>;
  chapter_analytics: Array<{
    id: string;
    title: string;
    book_title: string;
    book_id: string;
    total_readings: number;
    completed_readings: number;
    completion_rate: number;
    reading_time_minutes: number;
  }>;
  reading_patterns: Array<{
    hour: number;
    activity_count: number;
  }>;
  recent_activity: Array<{
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    book: {
      id: string;
      title: string;
      author: string;
    };
    chapter?: {
      id: string;
      title: string;
    };
    progress_percentage: number;
    reading_time_minutes: number;
    updated_at: string;
  }>;
}

interface Props {
  analytics: ReadingProgressAnalytics;
  filters: {
    start_date: string;
    end_date: string;
  };
}

export default function ReadingProgressAnalyticsPage({ analytics, filters }: Props) {
  const [startDate, setStartDate] = useState(filters.start_date);
  const [endDate, setEndDate] = useState(filters.end_date);
  const [activeTab, setActiveTab] = useState('trends');

  const handleDateFilter = () => {
    window.location.href = `?start_date=${startDate}&end_date=${endDate}`;
  };

  const formatProgressDistribution = () => {
    const data = Object.entries(analytics.progress_distribution);
    return {
      labels: data.map(([range]) => range),
      datasets: [
        {
          data: data.map(([, count]) => count),
          backgroundColor: [
            '#ef4444', // red for 0-20%
            '#f97316', // orange for 21-40%
            '#eab308', // yellow for 41-60%
            '#3b82f6', // blue for 61-80%
            '#22c55e', // green for 81-99%
            '#15803d', // dark green for 100%
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };
  };

  const formatDailyProgress = () => {
    return {
      labels: analytics.daily_progress.map(item => new Date(item.date).toLocaleDateString()),
      datasets: [
        {
          label: 'New Readings',
          data: analytics.daily_progress.map(item => item.new_readings),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
        },
        {
          label: 'Completions',
          data: analytics.daily_progress.map(item => item.completions),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
        },
      ],
    };
  };

  const formatReadingPatterns = () => {
    const patterns = Array.from({ length: 24 }, (_, i) => {
      const pattern = analytics.reading_patterns.find(p => p.hour === i);
      return pattern ? pattern.activity_count : 0;
    });

    return {
      labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
      datasets: [
        {
          label: 'Reading Activity',
          data: patterns,
          backgroundColor: '#8b5cf6',
          borderColor: '#7c3aed',
          borderWidth: 1,
        },
      ],
    };
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatTimeSpent = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  const tabs = [
    { id: 'trends', label: 'Reading Trends' },
    { id: 'distribution', label: 'Progress Distribution' },
    { id: 'patterns', label: 'Activity Patterns' },
    { id: 'content', label: 'Content Analytics' }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Reading Progress Analytics - Admin" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reading Progress Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Detailed insights into user reading behavior and progress
            </p>
          </div>
          
          {/* Date Filter */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="start_date" className="text-sm font-medium">From:</label>
                <input
                  id="start_date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="end_date" className="text-sm font-medium">To:</label>
                <input
                  id="end_date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
                />
              </div>
              <button
                onClick={handleDateFilter}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Apply Filter
              </button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reading Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.overview.total_reading_progress.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{analytics.overview.active_readers} active readers</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.overview.completion_rate}%</p>
                <p className="text-xs text-gray-500">{analytics.overview.completed_readings.toLocaleString()} completed readings</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.overview.average_progress}%</p>
                <p className="text-xs text-gray-500">{analytics.overview.average_reading_speed} chapters/day avg speed</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border">
          <div className="flex border-b border-gray-200 dark:border-neutral-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Reading Trends Tab */}
            {activeTab === 'trends' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Daily Reading Activity</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">New reading sessions and completions over time</p>
                <div style={{ height: '400px' }}>
                  <Line 
                    data={formatDailyProgress()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        title: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {/* Progress Distribution Tab */}
            {activeTab === 'distribution' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Progress Distribution</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Distribution of reading progress percentages</p>
                  <div style={{ height: '300px' }}>
                    <Doughnut 
                      data={formatProgressDistribution()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom' as const,
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                              }
                            }
                          }
                        },
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Progress Summary</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Breakdown of reading progress ranges</p>
                  <div className="space-y-4">
                    {Object.entries(analytics.progress_distribution).map(([range, count]) => (
                      <div key={range} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            range === '100%' ? 'bg-green-500' :
                            range === '81-99%' ? 'bg-blue-500' :
                            range === '61-80%' ? 'bg-yellow-500' :
                            range === '41-60%' ? 'bg-orange-500' :
                            range === '21-40%' ? 'bg-red-400' : 'bg-gray-400'
                          }`} />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{range}</span>
                        </div>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-gray-300">
                          {count.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Activity Patterns Tab */}
            {activeTab === 'patterns' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Reading Activity by Hour</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">User reading activity patterns throughout the day</p>
                <div style={{ height: '400px' }}>
                  <Bar 
                    data={formatReadingPatterns()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        title: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {/* Content Analytics Tab */}
            {activeTab === 'content' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Books */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top Books by Reading Activity</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Books with the most reading sessions</p>
                  <div className="space-y-4">
                    {analytics.top_books.slice(0, 5).map((book, index) => (
                      <div key={book.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-neutral-700">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-gray-300">
                              #{index + 1}
                            </span>
                            <h4 className="font-medium truncate text-gray-900 dark:text-white">{book.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">by {book.author}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{book.total_readings} sessions</span>
                            <span>{book.completion_rate}% completion</span>
                            <span>{book.average_progress}% avg progress</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Chapters */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Most Read Chapters</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Chapters with highest engagement</p>
                  <div className="space-y-4">
                    {analytics.chapter_analytics.slice(0, 5).map((chapter, index) => (
                      <div key={chapter.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-neutral-700">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-gray-300">
                              #{index + 1}
                            </span>
                            <h4 className="font-medium truncate text-gray-900 dark:text-white">{chapter.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{chapter.book_title}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{chapter.total_readings} sessions</span>
                            <span>{formatTimeSpent(chapter.reading_time_minutes)} reading time</span>
                            <span>{chapter.completion_rate}% completion</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Reading Activity
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Latest reading progress updates from users</p>
            <div className="space-y-4">
              {analytics.recent_activity.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-neutral-700">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{activity.user.name}</span>
                      <span className="text-gray-600 dark:text-gray-400">read</span>
                      <span className="font-medium text-gray-900 dark:text-white">{activity.book.title}</span>
                      {activity.chapter && (
                        <>
                          <span className="text-gray-600 dark:text-gray-400">-</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{activity.chapter.title}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>Progress: {activity.progress_percentage}%</span>
                      <span>Time: {formatTimeSpent(activity.reading_time_minutes)}</span>
                      <span>{new Date(activity.updated_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getProgressColor(activity.progress_percentage)}`} />
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      activity.progress_percentage === 100 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-gray-300'
                    }`}>
                      {activity.progress_percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}