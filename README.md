# LMS Frontend (Next.js)

This repository contains the frontend for the Learning Management System, built with Next.js (App Router), Tailwind CSS, and connects to the Strapi backend.

## Prerequisites

- **Node.js**: Version 20.x or higher
- **npm**: Version 6.x or higher

## Local Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables (if needed)**:
   Ensure you have a `.env` or `.env.local` file configured to point to your backend. Usually, this looks like:
   ```env
   NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the Frontend**:
   - The frontend application is available at: [http://localhost:3000](http://localhost:3000)

## Troubleshooting

- **Port Conflicts**: If port `3000` is already in use, the development server will fail to start. You can close the conflicting applications or specify different ports in your environment variables/commands.
- **Node Version**: If you encounter dependency issues or build failures, ensure your Node.js version meets the engine requirements (`>= 20.0.0`).
