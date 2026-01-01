# Dalat SmartRoute AI

## Overview
A smart routing solution for Dalat using AI-powered optimization.

## Features
- Intelligent route planning
- Real-time optimization
- AI-driven recommendations

## Getting Started
1. Clone the repository
2. Install dependencies
3. Configure settings
4. Run the application


## Download project
```bash
git clone https://github.com/wanghoc/Dalat_SmartRoute_AI.git
```
rename .env.example to .env
add your API key to .env

## Run the project
# Run client
```bash
cd client
npm install #(1st time)
npm run dev
```
# Run Prisma
```bash
cd server
npx prisma generate #(1st time)
npx prisma db push #(1st time)
npm run db:seed #(1st time)
npx prisma studio
```

# Run server
```bash
cd server
npm install #(1st time)
npm run dev
```

# Test raining Weather
http://localhost:3001/api/places/weather-recommendations?weatherId=500&limit=6