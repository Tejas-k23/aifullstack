# AIZone – AI Services Credit Management Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-username/your-repo/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Vite](https://img.shields.io/badge/bundler-Vite-blue.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/framework-React-61DAFB.svg)](https://react.dev/)

AIZone is a modern SaaS landing platform for an AI services company. It showcases WhatsApp-based AI agents that convert ordinary product photos into high-quality marketing visuals, while supporting credit management and pricing plans.

## Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contribution](#contribution)
- [License](#license)

## About

AIZone is a clean, marketing-focused React app built with Vite. It is designed to present an AI-powered WhatsApp image enhancement service, with sections for hero messaging, feature highlights, pricing, testimonials, and conversion-driven marketing copy.

## Tech Stack

- React
- Vite
- JavaScript (ES Modules)
- HTML / CSS
- Lucide React icons
- Framer Motion
- ESLint

## Features

- ✅ Modern SaaS landing page design
- ✅ WhatsApp AI agent messaging concept
- ✅ AI-enhanced product image showcase
- ✅ Pricing and credit plan presentation
- ✅ Responsive layout with animated content
- ✅ Testimonials and business use cases

## Installation

```bash
git clone https://github.com/your-username/your-repo.git
cd justwork-main/ai
npm install
```

## Usage

Start the frontend locally:

```bash
npm run dev
```

Open the app in your browser at:

```bash
http://localhost:5173
```

Use the landing page to explore:

- Hero section and value proposition
- Feature showcase for AI marketing imagery
- Pricing plans and credit management
- Testimonials and business use cases

## API Endpoints

The frontend currently expects a backend payments endpoint for purchase workflows:

- `POST http://localhost:3000/api/payments/create-order`
  - Payload: `{ package_id, phone_number }`

> If you connect a real backend, update the API base URL or add an environment variable for it.

## Folder Structure

```text
ai/
├── public/                # Static assets and image files
├── src/
│   ├── components/        # React UI components
│   ├── App.jsx            # Main app component
│   ├── index.css          # Global styling
│   └── main.jsx           # React bootstrapping
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

## Environment Variables

The frontend does not require any environment variables by default, but you can add these if you connect to a backend service:

- `VITE_API_BASE_URL` - Base URL for backend API requests
- `NODE_ENV` - Environment mode (`development`, `production`)

## Deployment

Build the app for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Deploy the contents of the `dist/` folder to any static hosting provider such as:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Contribution

Contributions are welcome!

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is released under the MIT License.

---

Made with ❤️ for AI-first marketing teams.
