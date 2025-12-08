# Smart Dairy IoT Dashboard

## Overview
A full-stack web application for monitoring dairy cows using IoT sensors and predictive analytics. Helps farmers track individual cow health, milk yield, feed requirements, and profit estimation.

## Project Structure
- **Backend** (Node.js/Express): REST API on port 3000 (localhost)
- **Frontend** (React/Vite): Web dashboard on port 5000 (0.0.0.0)
- **Database**: Replit Database for cow data storage

## Tech Stack
- Backend: Node.js, Express, @replit/database
- Frontend: React, Vite, TailwindCSS, Recharts, React Router
- Build System: Vite
- Package Manager: npm

## Core Features
1. Cow Identification & Profile Management
2. Real-Time Dashboard with Farm Metrics
3. Searchable Cow Status Table
4. Farm Map View with Zone Visualization
5. Milk Yield Monitoring with Charts
6. Feeding Recommendation Engine
7. Health Monitoring & Scoring
8. Profit Analytics Module

## API Endpoints
- GET /api/cows - List all cows
- GET /api/cows/:id - Get cow details
- POST /api/cows - Add new cow
- PUT /api/cows/:id - Update cow
- GET /api/dashboard/stats - Dashboard statistics
- GET /api/yield/:id - Get yield data
- POST /api/yield/:id - Add yield entry
- GET /api/feed/:id - Get feed requirements
- GET /api/health/:id - Get health metrics

## Recent Changes
- Initial setup completed (December 8, 2025)
- Full-stack application built with backend and frontend
- Sample cow data initialized in database
- Health scoring and feed calculation algorithms implemented
- Responsive UI with TailwindCSS
