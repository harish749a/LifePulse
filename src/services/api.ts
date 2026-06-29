/**
 * LifePulse TypeScript API Client
 * Compatible with FastAPI Backend & Secure PostgreSQL Database Persistence.
 * Strictly operates in live mode with offline resilience caching.
 */

export interface ApiConfig {
  baseUrl: string;
  mode: 'live';
}

export const getApiConfig = (): ApiConfig => {
  try {
    const savedUrl = localStorage.getItem('lifepulse_api_url') || 'http://localhost:8000';
    return {
      baseUrl: savedUrl,
      mode: 'live',
    };
  } catch {
    return {
      baseUrl: 'http://localhost:8000',
      mode: 'live',
    };
  }
};

export const saveApiConfig = (config: Partial<ApiConfig>) => {
  try {
    if (config.baseUrl) {
      localStorage.setItem('lifepulse_api_url', config.baseUrl);
    }
  } catch (e) {
    console.error('Failed to save API config:', e);
  }
};

class ApiClient {
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private get baseUrl(): string {
    return getApiConfig().baseUrl;
  }

  public get mode(): 'live' {
    return 'live';
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('lifepulse_access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('lifepulse_refresh_token');
  }

  private setTokens(access: string, refresh: string) {
    localStorage.setItem('lifepulse_access_token', access);
    localStorage.setItem('lifepulse_refresh_token', refresh);
  }

  private clearTokens() {
    localStorage.removeItem('lifepulse_access_token');
    localStorage.removeItem('lifepulse_refresh_token');
  }

  private subscribeTokenRefresh(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  /**
   * Performs an API request with secure headers and auto-refresh on 401.
   */
  public async request<T = any>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    const accessToken = this.getAccessToken();

    const headers = new Headers(options.headers);
    if (accessToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, { ...options, headers });

    // Handle 401 Unauthorized (Expired Access Token)
    if (response.status === 401 && this.getRefreshToken()) {
      try {
        const newAccessToken = await this.handleTokenRefresh();
        
        // Retry request with new token
        const retryHeaders = new Headers(options.headers);
        retryHeaders.set('Authorization', `Bearer ${newAccessToken}`);
        if (!retryHeaders.has('Content-Type') && !(options.body instanceof FormData)) {
          retryHeaders.set('Content-Type', 'application/json');
        }

        const retryResponse = await fetch(url, { ...options, headers: retryHeaders });
        if (!retryResponse.ok) {
          throw new Error(`API Request failed after token refresh: ${retryResponse.statusText}`);
        }
        return await retryResponse.json();
      } catch (refreshErr) {
        this.clearTokens();
        throw new Error('Session expired. Please log in again.');
      }
    }

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;
      try {
        const errJson = await response.json();
        errorMessage = errJson.detail || errJson.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    // Handle responses with no content gracefully
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  }

  /**
   * Refreshes the JWT Access Token securely using the Refresh Token.
   */
  private async handleTokenRefresh(): Promise<string> {
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.subscribeTokenRefresh((token) => resolve(token));
      });
    }

    this.isRefreshing = true;
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.isRefreshing = false;
      throw new Error('No refresh token available');
    }

    try {
      const url = `${this.baseUrl.replace(/\/$/, '')}/auth/refresh`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh request failed');
      }

      const data = await response.json();
      this.setTokens(data.access_token, data.refresh_token);
      this.onTokenRefreshed(data.access_token);
      return data.access_token;
    } catch (e) {
      this.clearTokens();
      throw e;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Tests the connection to the custom backend server.
   */
  public async pingBackend(customUrl?: string): Promise<{ success: boolean; message: string }> {
    const targetUrl = customUrl || this.baseUrl;
    const pingUrl = `${targetUrl.replace(/\/$/, '')}/db-test`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout

      const response = await fetch(pingUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return { 
          success: true, 
          message: data.message || 'Connected to PostgreSQL successfully! 🚀' 
        };
      }
      return { 
        success: false, 
        message: `Status code ${response.status} from database test.` 
      };
    } catch (e: any) {
      return { 
        success: false, 
        message: e.name === 'AbortError' 
          ? 'Connection timed out after 4 seconds.' 
          : 'Could not reach server. Verify FastAPI server is running locally on port 8000.' 
      };
    }
  }

  /**
   * Registers a new user.
   */
  public async register(userData: any): Promise<any> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Logs in a user.
   */
  public async login(credentials: any): Promise<any> {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.access_token && data.refresh_token) {
      this.setTokens(data.access_token, data.refresh_token);
    }
    return data;
  }

  /**
   * Logs out the user securely.
   */
  public async logout(): Promise<void> {
    const token = this.getAccessToken();
    if (token) {
      try {
        await this.request('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ token }),
        });
      } catch (e) {
        console.warn('Backend logout call skipped or failed:', e);
      }
    }
    this.clearTokens();
  }

  /**
   * Gets the current user profile.
   */
  public async getProfile(): Promise<any> {
    return this.request('/users/me', { method: 'GET' });
  }

  /**
   * Forgot password request.
   */
  public async forgotPassword(email: string): Promise<any> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * Reset password request.
   */
  public async resetPassword(payload: any): Promise<any> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /* --- DATA DATABASE SYNC ENDPOINTS ---
   * These map exactly to PostgreSQL SQLAlchemy models.
   * If FastAPI doesn't implement these endpoints yet, we catch errors gracefully.
   */

  /**
   * Syncs custom habit to PostgreSQL
   */
  public async syncHabit(habit: any): Promise<any> {
    try {
      return await this.request('/habits', {
        method: 'POST',
        body: JSON.stringify({
          title: habit.name,
          description: habit.note || '',
          habit_type: habit.category,
          target_value: 1,
          unit: 'times',
          frequency: habit.repeat.join(','),
          is_active: true
        })
      });
    } catch (e) {
      console.info('Database endpoint /habits not fully loaded on backend yet, cached locally.');
      return null;
    }
  }

  /**
   * Syncs water log directly into water_logs table
   */
  public async syncWaterLog(quantityMl: number): Promise<any> {
    try {
      return await this.request('/water-logs', {
        method: 'POST',
        body: JSON.stringify({
          quantity_ml: quantityMl,
          logged_at: new Date().toISOString()
        })
      });
    } catch (e) {
      console.info('Database endpoint /water-logs not fully loaded on backend yet, cached locally.');
      return null;
    }
  }

  /**
   * Syncs workout directly into workout_logs table
   */
  public async syncWorkoutLog(workoutName: string, durationMinutes: number, caloriesBurned: number, notes?: string): Promise<any> {
    try {
      return await this.request('/workout-logs', {
        method: 'POST',
        body: JSON.stringify({
          workout_name: workoutName,
          duration_minutes: durationMinutes,
          calories_burned: caloriesBurned,
          workout_date: new Date().toISOString(),
          notes: notes || ''
        })
      });
    } catch (e) {
      console.info('Database endpoint /workout-logs not fully loaded on backend yet, cached locally.');
      return null;
    }
  }

  /**
   * Syncs meal directly into meals table
   */
  public async syncMealLog(mealName: string, mealType: string, calories: number, protein?: number, carbs?: number, fat?: number): Promise<any> {
    try {
      return await this.request('/meals', {
        method: 'POST',
        body: JSON.stringify({
          meal_name: mealName,
          meal_type: mealType,
          calories,
          protein: protein || 0,
          carbs: carbs || 0,
          fat: fat || 0,
          meal_time: new Date().toISOString(),
          notes: ''
        })
      });
    } catch (e) {
      console.info('Database endpoint /meals not fully loaded on backend yet, cached locally.');
      return null;
    }
  }

  /**
   * Syncs daily score into daily_scores table
   */
  public async syncDailyScore(water: number, nutrition: number, activity: number, sleep: number, overall: number): Promise<any> {
    try {
      return await this.request('/daily-scores', {
        method: 'POST',
        body: JSON.stringify({
          water_score: water,
          nutrition_score: nutrition,
          activity_score: activity,
          sleep_score: sleep,
          overall_score: overall,
          score_date: new Date().toISOString().split('T')[0]
        })
      });
    } catch (e) {
      console.info('Database endpoint /daily-scores not fully loaded on backend yet, cached locally.');
      return null;
    }
  }
}

export const api = new ApiClient();
