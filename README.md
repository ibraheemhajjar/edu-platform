# E-commerce Educational Platform

A full-stack e-commerce-enabled educational platform built with NestJS, Next.js, and MedusaJS in a monorepo structure. Students can browse courses, make purchases, and manage enrollments through an integrated system.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Using the Application](#using-the-application)
- [API Documentation](#api-documentation)
- [Shared Library](#shared-library)
- [Environment Variables](#environment-variables)
- [Known Limitations](#known-limitations)
- [Production Build](#production-build)

## Overview

This project demonstrates a complete e-commerce integration for an educational platform with three main components:

- **Backend (NestJS)**: Course and student management with enrollment system
- **E-commerce (MedusaJS)**: Product catalog and payment processing
- **Frontend (Next.js)**: Admin dashboard and student purchase interface

The system supports:

- CRUD operations for courses and students
- Course purchase flow with payment processing
- Automatic enrollment after successful payment
- Shared type-safe code across all applications

## Tech Stack

### Backend

- **NestJS** with Fastify adapter
- **Prisma ORM** for database operations
- **PostgreSQL** for data persistence
- **nestjs-zod** for DTO validation
- **Zod** schemas from shared library

### E-commerce

- **MedusaJS v2.10.3** for e-commerce functionality
- **PostgreSQL** for Medusa data
- **Redis** for caching
- Custom routes for course import and purchase

### Frontend

- **Next.js v15** with App Router
- **React Query** for server state management
- **React Hook Form** with Zod for form validation
- **Tailwind CSS** with shadcn/ui components

### Monorepo

- **Nx** for monorepo management and build orchestration
- **TypeScript** for type safety across all apps
- **Shared library** for types, schemas, and constants

## Architecture

┌─────────────┐ ┌──────────────┐ ┌─────────────┐
│ Frontend │────────▶│ Backend │◀────────│ MedusaJS │
│ (Next.js) │ REST │ (NestJS) │ Import │ (E-commerce)│
│ │ │ │ │ │
│ - Courses │ │ - Courses │ │ - Products │
│ - Students │ │ - Students │ │ - Orders │
│ - Store │ │ - Enrollments│ │ - Payment │
└─────────────┘ └──────────────┘ └─────────────┘
│ │ │
└───────────────────────┴─────────────────────────┘
Shared Library (@edu-platform/shared)

- Types, Schemas, Constants

### Purchase Flow

1. **Frontend** displays courses from MedusaJS Store API
2. **User** enters email and clicks purchase
3. **Frontend** creates cart, adds item, initializes payment
4. **MedusaJS** processes order and emits `order.placed` event
5. **Subscriber** fetches student by email, calls backend with `studentId`
6. **Backend** enrolls student in purchased courses
7. **Frontend** displays enrolled courses on My Courses page

## Prerequisites

- **Node.js**: v20.x or higher
- **npm**: v9.x or higher
- **Docker**: For PostgreSQL and Redis
- **Git**: For version control

## Project Structure

edu-platform/
├── apps/
│ ├── backend/ # NestJS backend
│ │ ├── prisma/ # Database schema and migrations
│ │ ├── src/
│ │ │ ├── course/ # Course module
│ │ │ ├── student/ # Student module
│ │ │ └── prisma/ # Prisma service
│ │ └── .env # Backend environment variables
│ │
│ ├── frontend/ # Next.js frontend
│ │ ├── app/ # App router pages
│ │ ├── components/ # React components
│ │ ├── lib/ # API clients and utilities
│ │ └── .env.local # Frontend environment variables
│ │
│ └── medusa/ # MedusaJS e-commerce
│ ├── src/
│ │ ├── api/custom/ # Custom API routes
│ │ └── subscribers/# Event subscribers
│ └── .env # Medusa environment variables
│
├── libs/
│ └── shared/ # Shared library
│ └── src/
│ ├── types/ # TypeScript types
│ ├── schemas/ # Zod validation schemas
│ └── constants/ # Shared constants
│
├── docker-compose.yml # PostgreSQL and Redis
├── nx.json # Nx configuration
├── tsconfig.base.json # Base TypeScript config
└── README.md # This file

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd edu-platform
2. Install Dependencies
bashnpm install
3. Start Docker Services
Start PostgreSQL and Redis:
bashdocker-compose up -d
Verify containers are running:
bashdocker ps
You should see:

edu-platform-postgres on port 5432 and 5433
edu-platform-redis on port 6379

4. Configure Environment Variables
Backend (apps/backend/.env)
envDATABASE_URL="postgresql://postgres:postgres@localhost:5432/edu_platform"
PORT=3000
Frontend (apps/frontend/.env.local)
envNEXT_PUBLIC_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_61e3d0913524b9e2bfc75dc794e3e0f2f00456cf5d556d18563c40673f463980
MedusaJS (apps/medusa/.env)
envMEDUSA_ADMIN_ONBOARDING_TYPE=default
STORE_CORS=http://localhost:3001,http://localhost:8000,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/medusa_store
BACKEND_URL=http://localhost:3000
5. Run Database Migrations
Backend Database
bashcd apps/backend
npx prisma migrate dev
cd ../..
MedusaJS Database
bashcd apps/medusa
npx medusa db:migrate
cd ../..
6. Build Shared Library
The shared library must be built before starting other applications:
bashnpx nx build shared
7. Create MedusaJS Admin User
bashcd apps/medusa
npx medusa user -e admin@example.com -p supersecret
cd ../..
8. Create USD Region in MedusaJS

Start MedusaJS: npx nx serve medusa
Open http://localhost:9000/app
Login with credentials from step 7
Go to Settings > Regions
Click Create
Fill in:

Name: United States
Currency: US Dollar
Countries: Select United States
Payment Providers: System (DEFAULT)


Click Save

Running the Application
Start All Services
Open three separate terminal windows:
Terminal 1 - Backend:
bashnpx nx serve backend
Backend will be available at http://localhost:3000
Terminal 2 - MedusaJS:
bashnpx nx serve medusa
MedusaJS will be available at http://localhost:9000
Admin dashboard at http://localhost:9000/app
Terminal 3 - Frontend:
bashcd apps/frontend
npm run dev
Frontend will be available at http://localhost:3001
Using the Application
1. Create Courses
Navigate to http://localhost:3001/courses

Fill in course details (title, description, price, author)
Check "Published" to make it available for purchase
Click "Create Course"
Repeat to create multiple courses

2. Import Courses to MedusaJS
Courses must be imported from backend to MedusaJS to be purchasable:
bashcurl http://localhost:9000/custom/courses/import
Or use Postman/browser to visit the URL.
Expected response:
json{
  "success": true,
  "imported": 3,
  "skipped": 0,
  "message": "Imported 3 courses, skipped 0 duplicates"
}
3. Create Students
Navigate to http://localhost:3001/students

Enter student name and email
Click "Create Student"
Remember the email for purchase testing

4. Purchase a Course
Navigate to http://localhost:3001/store

Browse available courses
Click "Purchase Course" on any course
Enter the student email you created
Click "Complete Purchase"
Check MedusaJS logs to verify enrollment

5. View Enrolled Courses
Navigate to http://localhost:3001/my-courses

Enter the student email
Click "View Courses"
See all enrolled courses for that student

6. Edit Courses/Students

Click "Edit" button on any course or student
Modify the information
Click "Update" to save changes
Click "Cancel" to discard changes

API Documentation
Backend API (http://localhost:3000/api)
Courses

POST /courses - Create a course

json  {
    "title": "Course Title",
    "description": "Course description",
    "price": 49.99,
    "author": "Author Name",
    "published": true
  }

GET /courses - List all courses
GET /courses/:id - Get course by ID
PATCH /courses/:id - Update a course
DELETE /courses/:id - Delete a course
GET /courses/sync - Get courses for MedusaJS import

Students

POST /students - Create a student

json  {
    "name": "Student Name",
    "email": "student@example.com"
  }

GET /students - List all students (includes enrollments)
GET /students/:id - Get student by ID
PATCH /students/:id - Update a student
DELETE /students/:id - Delete a student

Enrollments

POST /students/enroll - Manually enroll a student

json  {
    "studentId": "uuid",
    "courseId": "uuid"
  }

POST /students/enroll-from-order - Enroll from order (called by MedusaJS)

json  {
    "studentId": "uuid",
    "courseIds": ["uuid1", "uuid2"]
  }
MedusaJS API (http://localhost:9000)
Custom Routes

GET /custom/courses/import - Import courses from backend
GET /custom/products - List all products with course metadata
POST /custom/purchase - Complete purchase (custom route with payment init)

Store API

GET /store/regions - List available regions
POST /store/carts - Create a shopping cart
POST /store/carts/:id/line-items - Add item to cart
POST /store/carts/:id/complete - Complete cart (standard way)

Shared Library
The @edu-platform/shared library provides type-safe code sharing across all applications.
Types
Located in libs/shared/src/types/:

course.types.ts: Course, CreateCourseInput, UpdateCourseInput
student.types.ts: Student, CreateStudentInput, UpdateStudentInput, Enrollment
medusa.types.ts: MedusaProduct, MedusaRegion, MedusaCart, Order, OrderItem

Schemas
Located in libs/shared/src/schemas/:

course.schemas.ts: Zod validation schemas for course operations
student.schemas.ts: Zod validation schemas for student operations

Constants
Located in libs/shared/src/constants/:

API_ROUTES: Centralized API endpoint paths

Usage Example
typescript// In backend
import { CreateCourseInput, createCourseSchema } from '@edu-platform/shared';

// In frontend
import { Course, createCourseSchema } from '@edu-platform/shared';

// In MedusaJS
import { Order, API_ROUTES } from '@edu-platform/shared';
Updating Shared Library
When you modify the shared library:

Make changes in libs/shared/src/
Rebuild: npx nx build shared
Restart consuming applications

Environment Variables
All environment variables are documented in .env.example files in each app directory:

apps/backend/.env.example - Backend configuration
apps/frontend/.env.local.example - Frontend configuration
apps/medusa/.env.example - MedusaJS configuration

Copy these files and update values for your environment:
bashcp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.local.example apps/frontend/.env.local
cp apps/medusa/.env.example apps/medusa/.env
Known Limitations
Course Import

One-way sync: Import creates new products but doesn't delete products when courses are removed from backend
Manual trigger: Import must be triggered manually via API call
No updates: Changing course details in backend doesn't update existing products in MedusaJS

Workaround: Manually delete products from MedusaJS admin (http://localhost:9000/app) when courses are removed.
Product Enrichment

Products include metadata (course_id, author, category)
No image thumbnails (would require image hosting)
Simple category structure (metadata-based, not MedusaJS categories)

Student Lookup in Purchase Flow

Purchase requires student to exist in backend before purchase
Student is looked up by email from order
If student doesn't exist, enrollment fails (check MedusaJS logs)

Workaround: Always create students in backend before allowing them to purchase courses.
Production Build
Build all applications for production:
bash# Build all projects
npx nx run-many -t build -p backend frontend shared medusa

# Output locations:
# - Backend: dist/apps/backend
# - Frontend: apps/frontend/.next
# - Shared: dist/libs/shared
# - MedusaJS: apps/medusa/.medusa/server
Production Considerations

Environment Variables: Use production URLs and secure secrets
Database: Use managed PostgreSQL service (AWS RDS, DigitalOcean, etc.)
Redis: Use managed Redis service
CORS: Update CORS settings for production domains
Payment: Replace System provider with real payment provider (Stripe, PayPal)
Authentication: Implement proper authentication for admin vs student actions

Troubleshooting
"Cannot find module '@edu-platform/shared'"
Solution: Build the shared library first:
bashnpx nx build shared
Port Already in Use
If ports 3000, 3001, or 9000 are occupied:

Find process: netstat -ano | findstr :3000 (Windows) or lsof -i :3000 (Mac/Linux)
Kill process or change port in .env files

Database Connection Failed
Solution: Ensure Docker containers are running:
bashdocker-compose up -d
docker ps
MedusaJS "No regions found"
Solution: Create a USD region following step 8 in Setup Instructions.
Purchase Fails with "Student not found"
Solution: Ensure student exists in backend with the email used in purchase.
Project Statistics

Total Projects: 4 (backend, frontend, medusa, shared)
Lines of Code: ~3000+ (excluding node_modules)
TypeScript Coverage: 100%
Build Time: ~55 seconds for all projects
Technologies: 15+ (NestJS, Next.js, MedusaJS, Prisma, React Query, etc.)


Developed as a take-home assignment demonstrating:

Monorepo architecture with Nx
Full-stack TypeScript development
E-commerce integration
Shared code organization
Modern React patterns (Server Components, React Query, React Hook Form)
Type-safe API communication
Event-driven architecture (order.placed subscriber)
```
