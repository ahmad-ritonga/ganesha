import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { 
  Users, 
  TrendingUp, 
  UserPlus,
  Activity,
  Star,
  ShoppingCart,
  Calendar,
  Clock,
  Target
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
import { Bar, Line, Doughnut } from 'react-chartjs-2';

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
    title: 'User Engagement',
    href: '/admin/analytics/user-engagement',
  },
];

interface UserEngagementAnalytics {
  overview: {
    total_users: number;
    active_users: number;
    new_users: number;
    activity_rate: number;
  };
  daily_registrations: Array<{
    date: string;
    registrations: number;
  }>;
  daily_active_users: Array<{
    date: string;
    active_users: number;
  }>;
  engagement_levels: {
    high: number;
    medium: number;
    low: number;
    inactive: number;
  };
  top_engaged_users: Array<{
    id: string;
    name: string;
    email: string;
    member_since: string;
    reading_sessions: number;
    completed_readings: number;
    total_time_spent: number;
    reviews_count: number;
    purchases_count: number;
    engagement_score: number;
  }>;
  activity_patterns: Array<{
    hour: number;
    unique_users: number;
    total_activities: number;
  }>;
  retention_data: Array<{
    cohort_date: string;
    cohort_size: number;
    retention: {
      [key: string]: number;
    };
  }>;
  session_durations: {
    [key: string]: number;
  };
  conversion_funnel: {
    visitors: number;
    readers: number;
    purchasers: number;
    reviewers: number;
  };
  popular_content: Array<{
    id: string;
    title: string;
    author: string;
    unique_readers: number;
    avg_rating: number;
    total_reviews: number;
  }>;
}

interface Props {
  analytics: UserEngagementAnalytics;
  filters: {
    start_date: string;
    end_date: string;
  };
}

export default function UserEngagementAnalyticsPage({ analytics, filters }: Props) {
  const [startDate, setStartDate] = useState(filters.start_date);
  const [endDate, setEndDate] = useState(filters.end_date);
  const [activeTab, setActiveTab] = useState('growth');

  const handleDateFilter = () => {
    window.location.href = `?start_date=${startDate}&end_date=${endDate}`;
  };

  const formatRegistrationData = () => {
    return {
      labels: analytics.daily_registrations.map(item => new Date(item.date).toLocaleDateString()),
      datasets: [
        {
          label: 'New Users',
          data: analytics.daily_registrations.map(item => item.registrations),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
        },
      ],
    };
  };

  const formatActiveUsersData = () => {
    return {
      labels: analytics.daily_active_users.map(item => new Date(item.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Daily Active Users',
          data: analytics.daily_active_users.map(item => item.active_users),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
        },
      ],
    };
  };

  const formatEngagementLevels = () => {
    return {
      labels: ['High Engagement', 'Medium Engagement', 'Low Engagement', 'Inactive'],
      datasets: [
        {
          data: [
            analytics.engagement_levels.high,
            analytics.engagement_levels.medium,
            analytics.engagement_levels.low,
            analytics.engagement_levels.inactive,
          ],
          backgroundColor: ['#22c55e', '#3b82f6', '#eab308', '#ef4444'],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };
  };

  const formatActivityPatterns = () => {
    const patterns = Array.from({ length: 24 }, (_, i) => {
      const pattern = analytics.activity_patterns.find(p => p.hour === i);
      return pattern ? pattern.unique_users : 0;
    });

    return {
      labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
      datasets: [
        {
          label: 'Active Users',
          data: patterns,
          backgroundColor: '#8b5cf6',
          borderColor: '#7c3aed',
          borderWidth: 1,
        },
      ],
    };
  };

  const formatSessionDurations = () => {
    const durations = Object.entries(analytics.session_durations);
    return {
      labels: durations.map(([duration]) => duration),
      datasets: [
        {
          data: durations.map(([, count]) => count),
          backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };
  };

  const formatTimeSpent = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  const getEngagementBadgeColor = (score: number) => {
    if (score >= 50) return 'bg-green-100 text-green-800';
    if (score >= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'growth', label: 'User Growth' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'patterns', label: 'Activity Patterns' },
    { id: 'retention', label: 'Retention' },
    { id: 'content', label: 'Popular Content' }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User Engagement Analytics - Admin" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Engagement Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive insights into user behavior and engagement patterns
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.overview.total_users.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{analytics.overview.new_users} new this period</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.overview.active_users.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{analytics.overview.activity_rate}% activity rate</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.overview.total_users > 0 
                    ? ((analytics.conversion_funnel.purchasers / analytics.overview.total_users) * 100).toFixed(1)
                    : 0}%
                </p>
                <p className="text-xs text-gray-500">Users to purchasers</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.top_engaged_users.length > 0 
                    ? Math.round(analytics.top_engaged_users.reduce((sum, user) => sum + user.engagement_score, 0) / analytics.top_engaged_users.length)
                    : 0}
                </p>
                <p className="text-xs text-gray-500">Average engagement score</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
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
            {/* User Growth Tab */}
            {activeTab === 'growth' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Daily User Registrations</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">New user sign-ups over time</p>
                  <div style={{ height: '300px' }}>
                    <Line 
                      data={formatRegistrationData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
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

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Daily Active Users</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Users with reading activity by day</p>
                  <div style={{ height: '300px' }}>
                    <Line 
                      data={formatActiveUsersData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
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
              </div>
            )}

            {/* Engagement Tab */}
            {activeTab === 'engagement' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Engagement Levels</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Distribution of user engagement categories</p>
                  <div style={{ height: '300px' }}>
                    <Doughnut 
                      data={formatEngagementLevels()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom' as const,
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Session Duration Distribution</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">How long users spend reading</p>
                  <div style={{ height: '300px' }}>
                    <Doughnut 
                      data={formatSessionDurations()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom' as const,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Activity Patterns Tab */}
            {activeTab === 'patterns' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Activity Patterns by Hour</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">When users are most active throughout the day</p>
                <div style={{ height: '400px' }}>
                  <Bar 
                    data={formatActivityPatterns()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
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

            {/* Retention Tab */}
            {activeTab === 'retention' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">User Retention Cohorts</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">How well we retain new users over time</p>
                <div className="space-y-4">
                  {analytics.retention_data.map((cohort) => (
                    <div key={cohort.cohort_date} className="border border-gray-200 dark:border-neutral-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Cohort: {new Date(cohort.cohort_date).toLocaleDateString()}
                        </span>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-gray-300">
                          {cohort.cohort_size} users
                        </span>
                      </div>
                      <div className="grid grid-cols-7 gap-2 text-sm">
                        {Object.entries(cohort.retention).map(([day, rate]) => (
                          <div key={day} className="text-center">
                            <div className="text-xs text-gray-500">{day.replace('day_', 'D')}</div>
                            <div className={`font-medium ${
                              rate > 50 ? 'text-green-600' :
                              rate > 30 ? 'text-yellow-600' :
                              rate > 10 ? 'text-orange-600' : 'text-red-600'
                            }`}>
                              {rate}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Content Tab */}
            {activeTab === 'content' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Most Popular Content</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Books with highest user engagement</p>
                <div className="space-y-4">
                  {analytics.popular_content.map((book, index) => (
                    <div key={book.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-neutral-700">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-gray-300">
                            #{index + 1}
                          </span>
                          <h4 className="font-medium text-gray-900 dark:text-white">{book.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">by {book.author}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {book.unique_readers} readers
                          </span>
                          {book.avg_rating > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {book.avg_rating} ({book.total_reviews} reviews)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Engaged Users */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Engaged Users
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Users with highest engagement scores in the selected period</p>
            <div className="space-y-4">
              {analytics.top_engaged_users.slice(0, 10).map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-neutral-700">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-gray-300">
                        #{index + 1}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{user.email}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {user.reading_sessions} sessions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeSpent(user.total_time_spent)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {user.reviews_count} reviews
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        {user.purchases_count} purchases
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEngagementBadgeColor(user.engagement_score)}`}>
                      Score: {user.engagement_score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">User Conversion Funnel</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">How users progress through the platform</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Object.entries(analytics.conversion_funnel).map(([stage, count], index) => {
                const percentage = index === 0 ? 100 : 
                  ((count / analytics.conversion_funnel.visitors) * 100).toFixed(1);
                
                return (
                  <div key={stage} className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{count.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize mb-2">{stage}</div>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}