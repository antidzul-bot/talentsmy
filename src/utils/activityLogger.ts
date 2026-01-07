import { supabase } from '../lib/supabase';
import { useStore } from '../store';

export type ActivityAction =
    | 'LOGIN'
    | 'LOGOUT'
    | 'LOGIN_FAILED'
    | 'ORDER_CREATE'
    | 'ORDER_UPDATE'
    | 'ORDER_DELETE'
    | 'SUPPLIER_CREATE'
    | 'SUPPLIER_UPDATE'
    | 'SUPPLIER_DELETE'
    | 'PACKAGE_CREATE'
    | 'PACKAGE_UPDATE'
    | 'PACKAGE_DELETE'
    | 'FILE_UPLOAD'
    | 'PAYMENT_UPDATE'
    | 'NOTE_ADD'
    | 'NOTE_DELETE';

export interface ActivityLogData {
    action_type: ActivityAction;
    action_description: string;
    related_entity_type?: 'ORDER' | 'SUPPLIER' | 'PACKAGE' | 'USER';
    related_entity_id?: string;
    metadata?: Record<string, any>;
}

/**
 * Log user activity to the activity_logs table
 */
export const logActivity = async (data: ActivityLogData): Promise<void> => {
    try {
        const currentUser = useStore.getState().currentUser;

        if (!currentUser) {
            console.warn('Cannot log activity: No user logged in');
            return;
        }

        const logEntry = {
            user_email: currentUser.email,
            user_role: currentUser.role,
            action_type: data.action_type,
            action_description: data.action_description,
            related_entity_type: data.related_entity_type || null,
            related_entity_id: data.related_entity_id || null,
            metadata: data.metadata || null,
            ip_address: null, // Could be populated from a service
            user_agent: navigator.userAgent,
        };

        const { error } = await supabase
            .from('activity_logs')
            .insert(logEntry);

        if (error) {
            console.error('Failed to log activity:', error);
        }
    } catch (err) {
        console.error('Activity logging error:', err);
    }
};

/**
 * Log a failed login attempt (before user is authenticated)
 */
export const logFailedLogin = async (email: string, reason: string): Promise<void> => {
    try {
        const logEntry = {
            user_email: email,
            user_role: 'UNKNOWN',
            action_type: 'LOGIN_FAILED',
            action_description: `Failed login attempt: ${reason}`,
            related_entity_type: null,
            related_entity_id: null,
            metadata: { reason },
            ip_address: null,
            user_agent: navigator.userAgent,
        };

        await supabase.from('activity_logs').insert(logEntry);
    } catch (err) {
        console.error('Failed login logging error:', err);
    }
};
