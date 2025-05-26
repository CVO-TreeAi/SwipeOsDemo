import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../src/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    
    // If no userId provided, use the first user for demo
    let targetUserId = userId as string;
    
    if (!targetUserId) {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id')
        .limit(1)
        .single();
      
      if (usersError || !users) {
        return res.status(404).json({ error: 'No users found' });
      }
      
      targetUserId = users.id;
    }

    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', targetUserId)
      .single();

    if (userError) {
      return res.status(404).json({ error: 'User not found', details: userError });
    }

    // Fetch company data
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('owner_id', targetUserId)
      .single();

    // Fetch user settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    // Fetch AI conversation data
    const { data: conversationData, error: conversationError } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('is_active', true)
      .single();

    // Transform data to match the frontend interface
    const dashboardData = {
      profile: {
        userName: userData.full_name,
        avatarUrl: userData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.full_name)}&background=3b82f6&color=fff&size=64`,
        companyName: userData.company_name || 'TreeAi Services'
      },
      business: {
        companyLogoUrl: companyData?.logo_url || 'https://ui-avatars.com/api/?name=Company&background=6366f1&color=fff&size=48',
        contactEmail: companyData?.contact_email || userData.email,
        phone: companyData?.phone || userData.phone || '+1 (555) 123-4567'
      },
      settings: {
        notifications: settingsData?.notifications ?? true,
        darkMode: settingsData?.dark_mode ?? false,
        autoSync: settingsData?.auto_sync ?? true,
        locationServices: settingsData?.location_services ?? false,
        analytics: settingsData?.analytics ?? true
      },
      aiAssistant: {
        unreadCount: conversationData?.unread_count ?? 0
      }
    };

    res.status(200).json({ data: dashboardData });

  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data', details: error });
  }
} 