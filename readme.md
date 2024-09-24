Pet Adoption Backend
This is the backend API for the Pet Adoption Platform, allowing users to adopt pets, pet publishers to list pets, and administrators to manage adoption requests. The API is built using Node.js, Express.js, Prisma, and PostgreSQL, and it provides all the necessary endpoints to manage users, pets, adoptions, and more.

Table of Contents
Features
Technologies
Prerequisites
Installation
Database Schema
API Endpoints
Project Structure
Environment Variables
Running the Application
License
Features
User Roles: Adopters, Pet Publishers, and Admins.
Pet Adoption: Adopters can book pets, and the admin can approve or reject adoption requests.
Admin Dashboard: Admins can view adoption requests and manage the adoption process.
Pet Publishing: Publishers can submit pets for approval before they are listed.
Prisma ORM: Database queries are handled using Prisma ORM with PostgreSQL.
Technologies
Backend Framework: Node.js with Express.js
Database: PostgreSQL
ORM: Prisma
Language: TypeScript
Validation: Zod for data validation
Authentication: JWT
Deployment: Docker (optional)
Prerequisites
Before setting up the project, ensure you have the following installed:

Node.js (v16+)
PostgreSQL
npm or yarn
