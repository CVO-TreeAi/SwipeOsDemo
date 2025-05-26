# Supabase Setup Guide

This guide will help you set up the Supabase backend for the SwipeOS Wallet application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `swipeos-wallet`
   - Database Password: (generate a secure password)
   - Region: (choose closest to your users)
6. Click "Create new project"

## 2. Get Your Project Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role secret key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

**⚠️ Important**: Never commit the `.env.local` file to version control!

## 4. Set Up the Database Schema

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `database/schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** to execute the SQL

This will create:
- All required tables (`users`, `companies`, `user_settings`, `ai_conversations`)
- Triggers for automatic `updated_at` timestamps
- Sample data for testing
- Basic Row Level Security policies

## 5. Verify the Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see 4 tables created
3. Check the `users` table - it should have one sample user
4. Check other tables for related sample data

## 6. Test the Integration

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3002/setup` to test the API connection

3. If successful, visit `http://localhost:3002` to see the wallet with real data

## 7. Using the MCP Server (Optional)

The project is designed to work with the [Supabase MCP Server](https://github.com/coleam00/supabase-mcp.git) for advanced database operations through AI assistants.

To set up the MCP server:

1. Clone the repository:
   ```bash
   git clone https://github.com/coleam00/supabase-mcp.git
   ```

2. Build the Docker image:
   ```bash
   cd supabase-mcp
   docker build -t mcp/supabase .
   ```

3. Configure your AI assistant (Claude Desktop, Windsurf, etc.) with:
   ```json
   {
     "mcpServers": {
       "supabase": {
         "command": "docker",
         "args": ["run", "--rm", "-i", "-e", "SUPABASE_URL", "-e", "SUPABASE_SERVICE_KEY", "mcp/supabase"],
         "env": {
           "SUPABASE_URL": "your_supabase_url",
           "SUPABASE_SERVICE_KEY": "your_service_role_key"
         }
       }
     }
   }
   ```

## Troubleshooting

### API Returns Fallback Data
- Check that your `.env.local` file exists and has correct values
- Verify your Supabase project is active
- Check the browser console for any CORS or network errors

### Database Connection Errors
- Ensure your service role key has the correct permissions
- Check that Row Level Security policies allow your operations
- Verify the database schema was created successfully

### Settings Not Persisting
- Check that the `user_settings` table exists
- Verify the API endpoint `/api/user/update-settings` is working
- Look for errors in the browser console or server logs

## Security Notes

- The current setup uses permissive RLS policies for demo purposes
- In production, implement proper authentication and user-specific policies
- Never expose your service role key in client-side code
- Consider implementing proper user authentication with Supabase Auth

## Next Steps

1. Implement user authentication with Supabase Auth
2. Add proper RLS policies based on authenticated users
3. Extend the database schema for your specific use case
4. Set up real-time subscriptions for live data updates 