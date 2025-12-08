# Smart Dairy IoT Dashboard

## Overview
A full-stack web application for monitoring dairy cows using IoT sensors (ear tags) and predictive analytics. Designed for Tamil Nadu farmers to track individual cow health, milk yield, feed requirements, and profit estimation. Features bilingual support (English/Tamil).

## Project Structure
- **Backend** (Node.js/Express): REST API on port 3000 (localhost)
- **Frontend** (React/Vite): Web dashboard on port 5000 (0.0.0.0)
- **Database**: Replit Database for cow data storage

## Tech Stack
- Backend: Node.js, Express, @replit/database
- Frontend: React, Vite, TailwindCSS, Recharts, React Router, Leaflet (maps)
- Build System: Vite
- Package Manager: npm

## Core Features
1. **Cow Identification & Profile Management** - Add, edit, delete cows with ear tag IDs
2. **Real-Time Dashboard** - Farm metrics with INR currency
3. **Live GPS Map** - Leaflet-based map with cow location tracking (red dot markers)
4. **Bilingual Support** - English and Tamil (தமிழ்) language toggle
5. **Milk Yield Monitoring** - Charts and trends over 30 days
6. **Feeding Recommendation Engine** - Based on weight and lactation stage
7. **Health Monitoring & Scoring** - Temperature, activity, rumination tracking
8. **Profit Analytics** - Feed cost vs milk revenue calculations

## API Endpoints
- GET /api/cows - List all cows
- GET /api/cows/:id - Get cow details
- POST /api/cows - Add new cow
- PUT /api/cows/:id - Update cow
- DELETE /api/cows/:id - Delete cow
- GET /api/dashboard/stats - Dashboard statistics
- GET /api/yield/:id - Get yield data
- POST /api/yield/:id - Add yield entry
- GET /api/feed/:id - Get feed requirements
- GET /api/health/:id - Get health metrics
- GET /api/farm/settings - Get farm settings
- PUT /api/farm/settings - Update farm settings
- POST /api/cows/:id/location - Update cow GPS location

## Key Components
- `Navigation.jsx` - Top navigation with language toggle
- `LiveMap.jsx` - Leaflet map for cow tracking
- `CowForm.jsx` - Add/Edit cow modal form
- `CowManagement.jsx` - Full CRUD for cows
- `Dashboard.jsx` - Main dashboard view
- `CowDetail.jsx` - Individual cow details with charts

## User Preferences
- Target audience: Tamil Nadu dairy farmers
- Currency: Indian Rupees (INR)
- Default cow breeds: Sahiwal, Gir, Red Sindhi, and other Indian breeds
- Bilingual: English (default) and Tamil

## Recent Changes
- December 8, 2025: Major enhancement with Tamil language support
- Added Leaflet map integration for GPS cow tracking
- Implemented full cow management (add, edit, delete)
- Updated pricing to INR (₹45/liter milk price)
- Added Indian cow breeds (Sahiwal, Gir, Kangayam, etc.)
- Enhanced UI with better navigation and responsive design
- Added IoT status indicators for ear tag sensors
