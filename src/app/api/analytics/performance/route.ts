import { NextRequest, NextResponse } from 'next/server';
import { auditLogging } from '@/lib/security';

interface PerformanceMetrics {
  pageLoadTime?: number;
  domContentLoaded?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  timeToInteractive?: number;
}

interface PerformanceReport {
  metrics: PerformanceMetrics;
  url: string;
  userAgent: string;
  timestamp: number;
}

// In-memory store for performance metrics (use database in production)
const performanceMetrics: PerformanceReport[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: PerformanceReport = await request.json();
    const { metrics, url, userAgent, timestamp } = body;

    // Validate the performance report
    if (!metrics || !url || !userAgent || !timestamp) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Invalid performance report data' 
        },
        { status: 400 }
      );
    }

    // Store the performance metrics
    performanceMetrics.push({
      metrics,
      url,
      userAgent,
      timestamp,
    });

    // Keep only the last 1000 entries to prevent memory issues
    if (performanceMetrics.length > 1000) {
      performanceMetrics.splice(0, performanceMetrics.length - 1000);
    }

    // Log performance issues if detected
    const webVitals = {
      lcp: metrics.largestContentfulPaint,
      fid: metrics.firstInputDelay,
      cls: metrics.cumulativeLayoutShift,
    };

    // Check for performance issues based on Web Vitals thresholds
    const issues: string[] = [];
    if (webVitals.lcp && webVitals.lcp > 2500) {
      issues.push('Poor LCP (Largest Contentful Paint)');
    }
    if (webVitals.fid && webVitals.fid > 100) {
      issues.push('Poor FID (First Input Delay)');
    }
    if (webVitals.cls && webVitals.cls > 0.1) {
      issues.push('Poor CLS (Cumulative Layout Shift)');
    }

    if (issues.length > 0) {
      console.warn('Performance issues detected:', {
        url,
        issues,
        metrics: webVitals,
      });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Performance metrics recorded successfully',
    });

  } catch (error) {
    console.error('Performance analytics error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to record performance metrics' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const url = searchParams.get('url');

    let filteredMetrics = performanceMetrics;

    // Filter by URL if specified
    if (url) {
      filteredMetrics = performanceMetrics.filter(metric => 
        metric.url.includes(url)
      );
    }

    // Sort by timestamp (most recent first) and limit results
    const sortedMetrics = filteredMetrics
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);

    // Calculate aggregated statistics
    const stats = calculatePerformanceStats(sortedMetrics);

    return NextResponse.json({
      status: 'success',
      data: {
        metrics: sortedMetrics,
        stats,
        total: filteredMetrics.length,
      },
    });

  } catch (error) {
    console.error('Get performance analytics error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve performance metrics' 
      },
      { status: 500 }
    );
  }
}

function calculatePerformanceStats(metrics: PerformanceReport[]) {
  if (metrics.length === 0) {
    return null;
  }

  const stats = {
    pageLoadTime: { avg: 0, min: 0, max: 0, p95: 0 },
    firstContentfulPaint: { avg: 0, min: 0, max: 0, p95: 0 },
    largestContentfulPaint: { avg: 0, min: 0, max: 0, p95: 0 },
    firstInputDelay: { avg: 0, min: 0, max: 0, p95: 0 },
    cumulativeLayoutShift: { avg: 0, min: 0, max: 0, p95: 0 },
  };

  const metricKeys = Object.keys(stats) as (keyof typeof stats)[];

  metricKeys.forEach(key => {
    const values = metrics
      .map(m => m.metrics[key])
      .filter(v => v !== undefined && v !== null) as number[];

    if (values.length > 0) {
      values.sort((a, b) => a - b);
      
      stats[key].avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      stats[key].min = values[0];
      stats[key].max = values[values.length - 1];
      stats[key].p95 = values[Math.floor(values.length * 0.95)];
    }
  });

  return stats;
}

