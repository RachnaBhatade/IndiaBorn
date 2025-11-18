# Indiaborn Frontend

React frontend application for Indiaborn e-commerce platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will run on http://localhost:3000 (or the next available port).

## Build

To build for production:
```bash
npm run build
```

The built files will be output to `../Indiaborn.Api/wwwroot` for the backend to serve.

## Development

- The frontend uses Vite for fast development
- API calls are proxied to `http://localhost:5000` during development
- In production, the backend serves the built React app from `wwwroot`

## Project Structure

- `src/components/` - React components
- `src/pages/` - Page components
- `src/services/` - API service layer
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions
- `src/styles.css` - Global styles

