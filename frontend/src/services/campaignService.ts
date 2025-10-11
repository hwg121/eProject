import { apiClient } from './api';

export interface CampaignSetting {
  id: number;
  metric_name: string;
  goal_value: number;
  baseline_value: number;
  baseline_captured_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignStatOverview {
  metric_name: string;
  current_value: number;
  goal_value: number;
  baseline_value: number;
  baseline_captured_at: string | null;
  progress: number;
  growth: number;
}

export interface CampaignStatsResponse {
  visitors: CampaignStatOverview;
  views: CampaignStatOverview;
  content: CampaignStatOverview;
  rating: CampaignStatOverview;
}

class CampaignService {
  /**
   * Get all campaign settings
   */
  async getCampaignSettings(): Promise<CampaignSetting[]> {
    try {
      // apiClient.get() already extracts 'data' from Laravel response
      const data = await apiClient.get<CampaignSetting[]>(
        '/admin/campaign-settings'
      );
      return data;
    } catch (error) {
      console.error('Error fetching campaign settings:', error);
      throw error;
    }
  }

  /**
   * Get specific campaign setting by metric name
   */
  async getCampaignSetting(metric: string): Promise<CampaignSetting> {
    try {
      const data = await apiClient.get<CampaignSetting>(
        `/admin/campaign-settings/${metric}`
      );
      return data;
    } catch (error) {
      console.error(`Error fetching campaign setting for ${metric}:`, error);
      throw error;
    }
  }

  /**
   * Update campaign setting goal
   */
  async updateCampaignSetting(metric: string, goalValue: number): Promise<CampaignSetting> {
    try {
      const data = await apiClient.put<CampaignSetting>(
        `/admin/campaign-settings/${metric}`,
        { goal_value: goalValue }
      );
      return data;
    } catch (error) {
      console.error(`Error updating campaign setting for ${metric}:`, error);
      throw error;
    }
  }

  /**
   * Get stats overview with campaign data
   */
  async getStatsOverview(): Promise<CampaignStatsResponse> {
    try {
      const data = await apiClient.get<CampaignStatsResponse>(
        '/admin/stats/overview'
      );
      return data;
    } catch (error) {
      console.error('Error fetching stats overview:', error);
      throw error;
    }
  }
}

export const campaignService = new CampaignService();