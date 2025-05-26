# Supabase Setup Guide

## 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Note down your project URL and API keys

## 2. Security Best Practices
- **NEVER** commit API keys to version control
- **NEVER** expose the service role key to the client
- Keep the service role key secure and only use it in server-side API routes
- Use Row Level Security (RLS) policies for all tables
- Only use the anon/public key for client-side operations

## 3. Environment Variables
Create a `.env.local` file in your project root:

```env
# Public variables (safe to expose to browser)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Private variables (never expose to browser)
SUPABASE_SERVICE_KEY=your_service_role_key
```

**⚠️ Important**: Never commit the `.env.local` file to version control!

## 4. Admin Operations
All admin operations that require the service role key must be performed through secure API routes:

1. Use the `/api/admin/supabase` endpoint for admin operations
2. Implement proper admin authentication
3. Never call admin endpoints from client-side code without proper authentication

## 5. Database Setup
Follow these steps to set up your database:

1. Enable Row Level Security (RLS) on all tables
2. Create appropriate policies for each table
3. Test access with both anonymous and authenticated users

## 6. API Routes
The project includes secure API routes for admin operations:

- `GET /api/admin/supabase` - Fetch data with admin privileges
- `POST /api/admin/supabase` - Perform admin operations

Each route requires proper authentication and authorization.

## 7. Development Workflow
1. Copy `.env.local.example` to `.env.local`
2. Add your Supabase credentials
3. Never commit sensitive keys
4. Use `supabase` client for public operations
5. Use API routes for admin operations

## 8. Testing
1. Test with both anonymous and authenticated users
2. Verify RLS policies are working
3. Ensure admin routes are properly secured

## 9. Deployment
When deploying:

1. Set environment variables in your hosting platform
2. Double-check security configurations
3. Test admin routes in production
4. Monitor for any security issues

## 10. Troubleshooting
Common issues:

1. "Unauthorized" - Check your API keys
2. "Forbidden" - Check RLS policies
3. "Service role key exposed" - Remove from client-side code
4. "Admin route error" - Verify authentication

For more help, check the [Supabase documentation](https://supabase.com/docs).

## 11. Using the MCP Server (Optional)

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