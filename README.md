# NBail - Next.js AI Chat Application

A modern AI chat application built with Next.js, Supabase, and Groq API.

## Features

- AI Chat with Groq API integration
- AR Mode for visual analysis
- User authentication via Supabase
- Profile management
- Dark/Light mode
- Responsive design

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase (Auth & Database)
- Groq AI API
- shadcn/ui components

## Setup & Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/nbail.git
   cd nbail
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Create a `.env.local` file in the root directory with the required environment variables.

4. Run the development server
   ```
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Groq API Configuration
NEXT_PUBLIC_GROQ_API_KEY=your-groq-api-key
```

## License

MIT

