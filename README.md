# Patient Registration App

A frontend-only patient registration application using PGlite for client-side data storage. This app allows users to register patients, query patient records using SQL, and persist data across browser sessions.

## Features

- Patient registration with comprehensive validation
- SQL-based patient record querying
- Persistent data storage (survives page refreshes)
- Cross-tab synchronization
- Responsive design for all devices

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- PGlite (browser-based PostgreSQL)
- React Router
- React Hook Form
- Lucide React icons

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to the provided localhost URL

## Application Structure

- `/src/components`: UI components
- `/src/context`: React context for database access
- `/src/pages`: Page components
- `/src/services`: Database service and utilities
- `/src/types`: TypeScript type definitions

## Database Schema

The application uses the following tables:

### patients

- `id` (SERIAL PRIMARY KEY)
- `first_name` (TEXT)
- `last_name` (TEXT)
- `date_of_birth` (TEXT)
- `gender` (TEXT)
- `email` (TEXT)
- `phone` (TEXT)
- `address` (TEXT)
- `medical_history` (TEXT)
- `allergies` (TEXT)
- `emergency_contact` (TEXT)
- `insurance_provider` (TEXT)
- `insurance_number` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### query_history

- `id` (SERIAL PRIMARY KEY)
- `query` (TEXT)
- `timestamp` (TIMESTAMP)

## Core Functionality

### Register Patients

The application allows you to register new patients with comprehensive form validation. Required fields include:
- First and last name
- Date of birth
- Gender
- Email
- Phone
- Address

Optional fields include medical history, allergies, emergency contacts, and insurance information.

### Query Patient Records

A SQL query interface is provided to:
- View all patient records
- Filter patients based on criteria
- View query history
- Run custom SQL queries

### Data Persistence

Data is stored using PGlite, providing:
- Local browser storage
- SQL querying capabilities
- Data persistence across page refreshes

### Multi-Tab Support

The application uses BroadcastChannel API to synchronize data across multiple tabs:
- Updates in one tab are reflected in others
- Real-time updates across browser windows