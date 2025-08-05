// Simple monitoring and analytics service
export class MonitoringService {
  private static instance: MonitoringService;
  private metrics: Map<string, number> = new Map();
  private errors: Array<{ timestamp: Date; error: string; context?: any }> = [];

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  // Track API calls
  trackApiCall(endpoint: string, duration: number, success: boolean) {
    const key = `api_${endpoint}_${success ? 'success' : 'error'}`;
    this.incrementMetric(key);
    this.incrementMetric(`api_${endpoint}_duration`, duration);
  }

  // Track user actions
  trackUserAction(action: string, userId?: string) {
    this.incrementMetric(`user_action_${action}`);
    if (userId) {
      this.incrementMetric(`user_${userId}_actions`);
    }
  }

  // Track quiz completions
  trackQuizCompletion(quizId: string, score: number, userId?: string) {
    this.incrementMetric('quiz_completions');
    this.incrementMetric('quiz_total_score', score);

    if (userId) {
      this.incrementMetric(`user_${userId}_quizzes`);
    }
  }

  // Track lecture listens
  trackLectureListened(lectureId: string, duration: number, userId?: string) {
    this.incrementMetric('lecture_listens');
    this.incrementMetric('lecture_total_duration', duration);

    if (userId) {
      this.incrementMetric(`user_${userId}_lectures`);
    }
  }

  // Log errors
  logError(error: string, context?: any) {
    this.errors.push({
      timestamp: new Date(),
      error,
      context,
    });

    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100);
    }

    console.error('DeenQuest Error:', error, context);
  }

  // Get metrics
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // Get recent errors
  getRecentErrors(limit = 10) {
    return this.errors.slice(-limit);
  }

  // Get health status
  getHealthStatus() {
    const now = Date.now();
    const recentErrors = this.errors.filter(
      e => now - e.timestamp.getTime() < 5 * 60 * 1000 // Last 5 minutes
    );

    return {
      status: recentErrors.length > 10 ? 'unhealthy' : 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      errors: recentErrors.length,
      totalApiCalls: this.getMetric('api_calls_total'),
      totalUsers: this.getMetric('unique_users'),
    };
  }

  private incrementMetric(key: string, value = 1) {
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, current + value);
  }

  private getMetric(key: string): number {
    return this.metrics.get(key) || 0;
  }
}

// Middleware for tracking API calls
export function createMonitoringMiddleware() {
  const monitoring = MonitoringService.getInstance();

  return async (c: any, next: any) => {
    const start = Date.now();
    const path = c.req.path;

    try {
      await next();
      const duration = Date.now() - start;
      monitoring.trackApiCall(path, duration, true);
    } catch (error) {
      const duration = Date.now() - start;
      monitoring.trackApiCall(path, duration, false);
      monitoring.logError(`API Error on ${path}`, error);
      throw error;
    }
  };
}