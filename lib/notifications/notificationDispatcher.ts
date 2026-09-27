import { AppNotification } from '../types';

export type NotificationCategory = 'streak' | 'ai_verification' | 'peer_review' | 'passport' | 'booking' | 'strike' | 'token';

export interface DispatchNotificationParams {
  userId: string;
  type: NotificationCategory;
  title: string;
  message: string;
}

/**
 * Event-driven notification dispatcher.
 * Simulates background event pipelines (Webhooks / Supabase Realtime / Cron)
 */
export function dispatchNotification(params: DispatchNotificationParams): AppNotification {
  const newNotif: AppNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: params.userId,
    type: params.type,
    title: params.title,
    message: params.message,
    read: false,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('potential_passport_state_data_v3');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.notifications = [newNotif, ...(parsed.notifications || [])];
        localStorage.setItem('potential_passport_state_data_v3', JSON.stringify(parsed));
      }
    } catch (e) {
      console.error('Failed to dispatch notification to store:', e);
    }
  }

  return newNotif;
}
