# MayaShine - Jewelry Order Management System

A full-stack web application for managing jewelry orders with user authentication and file upload capabilities.

## Features

- 🛠️ Custom jewelry order submission
- 📸 Image upload support
- 👤 User authentication
- 🔐 Admin dashboard
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui components
  - React Query

- **Backend:**
  - Node.js
  - Express
  - PostgreSQL
  - TypeScript
  - Drizzle ORM

## Getting Started

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd MayaShine
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your database configuration:
   ```env
   DATABASE_URL=your_database_url
   PGDATABASE=your_database_name
   PGHOST=your_database_host
   PGPORT=5432
   PGUSER=your_database_user
   PGPASSWORD=your_database_password
   ```

4. Run database migrations:
   ```bash
   npm run migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express server
- `/shared` - Shared types and utilities
- `/uploads` - Uploaded files storage

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run test:db` - Test database connection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 