import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../src/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Setting up sample data...');

    // Insert sample data
    const { data: userData, error: userInsertError } = await supabaseAdmin
      .from('users')
      .upsert([
        {
          email: 'john.doe@treeai.com',
          full_name: 'John Doe',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
          company_name: 'TreeAi Services',
          phone: '+1 (555) 123-4567',
          is_active: true
        }
      ])
      .select()
      .single();

    if (userInsertError) {
      console.error('Error inserting user:', userInsertError);
    }

    if (userData) {
      // Insert company data
      const { error: companyInsertError } = await supabaseAdmin
        .from('companies')
        .upsert([
          {
            name: 'TreeAi Services',
            logo_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop',
            contact_email: 'contact@treeai.com',
            phone: '+1 (555) 123-4567',
            owner_id: userData.id
          }
        ]);

      if (companyInsertError) {
        console.error('Error inserting company:', companyInsertError);
      }

      // Insert user settings
      const { error: settingsInsertError } = await supabaseAdmin
        .from('user_settings')
        .upsert([
          {
            user_id: userData.id,
            notifications: true,
            dark_mode: false,
            auto_sync: true,
            location_services: false,
            analytics: true
          }
        ]);

      if (settingsInsertError) {
        console.error('Error inserting settings:', settingsInsertError);
      }

      // Insert AI conversation
      const { error: conversationInsertError } = await supabaseAdmin
        .from('ai_conversations')
        .upsert([
          {
            user_id: userData.id,
            title: 'TreeAi Assistant',
            last_message: 'How can I help you today? I\'m here to assist with your tree service needs.',
            unread_count: 3,
            is_active: true
          }
        ]);

      if (conversationInsertError) {
        console.error('Error inserting conversation:', conversationInsertError);
      }
    }

    res.status(200).json({ 
      message: 'Sample data inserted successfully',
      userData: userData
    });

  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({ error: 'Failed to setup database', details: error });
  }
} 