import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../src/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, settingKey, settingValue } = req.body;
    
    if (!userId || !settingKey || settingValue === undefined) {
      return res.status(400).json({ error: 'Missing required fields: userId, settingKey, settingValue' });
    }

    // Convert camelCase to snake_case for database
    const dbColumnMap: Record<string, string> = {
      notifications: 'notifications',
      darkMode: 'dark_mode',
      autoSync: 'auto_sync',
      locationServices: 'location_services',
      analytics: 'analytics'
    };

    const dbColumn = dbColumnMap[settingKey];
    if (!dbColumn) {
      return res.status(400).json({ error: `Invalid setting key: ${settingKey}` });
    }

    // Update the setting in the database
    const { data, error } = await supabase
      .from('user_settings')
      .update({ [dbColumn]: settingValue })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating setting:', error);
      return res.status(500).json({ error: 'Failed to update setting', details: error });
    }

    // Transform back to camelCase for response
    const responseData = {
      notifications: data.notifications,
      darkMode: data.dark_mode,
      autoSync: data.auto_sync,
      locationServices: data.location_services,
      analytics: data.analytics
    };

    res.status(200).json({ 
      message: 'Setting updated successfully',
      settings: responseData
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings', details: error });
  }
} 