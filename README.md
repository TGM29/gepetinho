# Gepetinho - Your AI Assistant

Gepetinho is a web application that provides an AI-powered chat assistant using OpenAI's GPT models. It allows users to sign up, chat with an AI assistant, and manage their profiles.

## Features

- User authentication (signup, login, profile management)
- AI chat assistant powered by OpenAI
- Conversation history
- User profiles and settings
- Responsive UI for desktop and mobile

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Cloudflare D1 (SQLite on the edge)
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Cloudflare Pages and Workers

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/TGM29/gepetinho.git
   cd gepetinho
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory with the following variables:
     ```
     OPENAI_API_KEY=your_openai_api_key
     JWT_SECRET=your_jwt_secret
     ```

4. Create a D1 database in Cloudflare:
   - Install Wrangler CLI: `npm install -g wrangler`
   - Login to Cloudflare: `wrangler login`
   - Create D1 database: `wrangler d1 create gepetinho-db`
   - Update the `wrangler.toml` file with your database ID

5. Apply database migrations:
   ```
   wrangler d1 execute gepetinho-db --file=./migrations/0001_create_tables.sql
   ```

6. Run the development server:
   ```
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

1. Configure your Cloudflare Pages project:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set build directory: `.next`
   - Add environment variables

2. Deploy to Cloudflare:
   ```
   npm run build
   wrangler pages publish .next
   ```

## License

MIT

## Author

[TGM29](https://github.com/TGM29) 