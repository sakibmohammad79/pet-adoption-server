<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pet Adoption Backend</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      width: 90%;
      max-width: 1200px;
      margin: auto;
      overflow: hidden;
      padding: 20px;
      background: #fff;
    }
    h1, h2, h3 {
      color: #333;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    ul li {
      margin-bottom: 10px;
    }
    pre {
      background: #333;
      color: #fff;
      padding: 10px;
      overflow-x: auto;
    }
    code {
      background: #f4f4f4;
      padding: 2px 4px;
      border-radius: 4px;
    }
    a {
      color: #3498db;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .section {
      margin-bottom: 40px;
    }
    .code-block {
      background: #f4f4f4;
      padding: 10px;
      border-radius: 5px;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Pet Adoption Backend</h1>
    <p>This is the backend API for the <strong>Pet Adoption Platform</strong>, allowing users to adopt pets, pet publishers to list pets, and administrators to manage adoption requests. The API is built using <strong>Node.js</strong>, <strong>Express.js</strong>, <strong>Prisma</strong>, and <strong>PostgreSQL</strong>, and it provides all the necessary endpoints to manage users, pets, adoptions, and more.</p>
    
    <h2>Table of Contents</h2>
    <ul>
      <li><a href="#features">Features</a></li>
      <li><a href="#technologies">Technologies</a></li>
      <li><a href="#prerequisites">Prerequisites</a></li>
      <li><a href="#installation">Installation</a></li>
      <li><a href="#database-schema">Database Schema</a></li>
      <li><a href="#api-endpoints">API Endpoints</a></li>
      <li><a href="#project-structure">Project Structure</a></li>
      <li><a href="#environment-variables">Environment Variables</a></li>
      <li><a href="#running-the-application">Running the Application</a></li>
      <li><a href="#license">License</a></li>
    </ul>
    
    <div id="features" class="section">
      <h2>Features</h2>
      <ul>
        <li><strong>User Roles</strong>: Adopters, Pet Publishers, and Admins.</li>
        <li><strong>Pet Adoption</strong>: Adopters can book pets, and the admin can approve or reject adoption requests.</li>
        <li><strong>Admin Dashboard</strong>: Admins can view adoption requests and manage the adoption process.</li>
        <li><strong>Pet Publishing</strong>: Publishers can submit pets for approval before they are listed.</li>
        <li><strong>Prisma ORM</strong>: Database queries are handled using Prisma ORM with PostgreSQL.</li>
      </ul>
    </div>
    
    <div id="technologies" class="section">
      <h2>Technologies</h2>
      <ul>
        <li><strong>Backend Framework</strong>: Node.js with Express.js</li>
        <li><strong>Database</strong>: PostgreSQL</li>
        <li><strong>ORM</strong>: Prisma</li>
        <li><strong>Language</strong>: TypeScript</li>
        <li><strong>Validation</strong>: Zod for data validation</li>
        <li><strong>Authentication</strong>: JWT</li>
        <li><strong>Deployment</strong>: Docker (optional)</li>
      </ul>
    </div>
    
    <div id="prerequisites" class="section">
      <h2>Prerequisites</h2>
      <p>Before setting up the project, ensure you have the following installed:</p>
      <ul>
        <li><strong>Node.js</strong> (v16+)</li>
        <li><strong>PostgreSQL</strong></li>
        <li><strong>npm</strong> or <strong>yarn</strong></li>
      </ul>
    </div>
    
    <div id="installation" class="section">
      <h2>Installation</h2>
      <ol>
        <li>
          <strong>Clone the repository</strong>:
          <pre><code>git clone https://github.com/yourusername/pet-adoption-backend.git
cd pet-adoption-backend</code></pre>
        </li>
        <li>
          <strong>Install dependencies</strong>:
          <pre><code>npm install</code></pre>
        </li>
        <li>
          <strong>Set up environment variables</strong>:
          <p>Create a <code>.env</code> file in the root directory of the project and provide the following variables:</p>
          <pre><code>DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/pet_adoption"
JWT_SECRET="your_secret_key"
PORT=3000</code></pre>
        </li>
        <li>
          <strong>Set up the database</strong>:
          <p>Run the following commands to set up the database with Prisma:</p>
          <pre><code>npx prisma migrate dev
npx prisma db seed</code></pre>
        </li>
        <li>
          <strong>Start the server</strong>:
          <pre><code>npm run dev</code></pre>
        </li>
      </ol>
    </div>
    
    <div id="database-schema" class="section">
      <h2>Database Schema</h2>
      <h3>Models</h3>
      <h4>User</h4>
      <ul>
        <li><strong>id</strong>: <code>String</code> (UUID)</li>
        <li><strong>email</strong>: <code>String</code> (unique)</li>
        <li><strong>password</strong>: <code>String</code></li>
        <li><strong>role</strong>: <code>Enum</code> (<code>ADMIN</code>, <code>ADOPTER</code>, <code>PUBLISHER</code>)</li>
      </ul>
      
      <h4>Pet</h4>
      <ul>
        <li><strong>id</strong>: <code>String</code> (UUID)</li>
        <li><strong>name</strong>: <code>String</code></li>
        <li><strong>image</strong>: <code>String</code></li>
        <li><strong>breed</strong>: <code>String</code></li>
        <li><strong>age</strong>: <code>Int</code></li>
        <li><strong>size</strong>: <code>Enum</code> (<code>SMALL</code>, <code>MEDIUM</code>, <code>LARGE</code>)</li>
        <li><strong>status</strong>: <code>Enum</code> (<code>PENDING</code>, <code>BOOKED</code>, <code>ADOPTED</code>)</li>
        <li><strong>publisherId</strong>: <code>String</code></li>
      </ul>
      
      <h4>Adoption</h4>
      <ul>
        <li><strong>id</strong>: <code>String</code> (UUID)</li>
        <li><strong>adopterId</strong>: <code>String</code></li>
        <li><strong>petId</strong>: <code>String</code></li>
        <li><strong>status</strong>: <code>Enum</code> (<code>PENDING</code>, <code>APPROVED</code>, <code>REJECTED</code>)</li>
      </ul>
    </div>
    
    <div id="api-endpoints" class="section">
      <h2>API Endpoints</h2>
      
      <h3>Authentication</h3>
      <ul>
        <li><strong>POST</strong> <code>/api/auth/register</code>: Register a new user (Adopter, Publisher, Admin)</li>
        <li><strong>POST</strong> <code>/api/auth/login</code>: Login with email and password to receive a JWT token.</li>
      </ul>
      
      <h3>Pets</h3>
      <ul>
        <li><strong>GET</strong> <code>/api/pets</code>: Get all pets available for adoption.</li>
        <li><strong>POST</strong> <code>/api/pets</code>: Create a new pet (publisher role only).</li>
        <li><strong>GET</strong> <code>/api/pets/:id</code>: Get details of a specific pet.</li>
        <li><strong>PATCH</strong> <code>/api/pets/:id/book</code>: Book a pet for adoption (adopter role only).</li>
      </ul>
      
      <h3>Adoptions</h3>
      <ul>
        <li><strong>POST</strong> <code>/api/adopt/book</code>: Book a pet for adoption (adopter role).</li>
        <li><strong>POST</strong> <code>/api/admin/adopt/approve</code>: Admin approves an adoption.</li>
        <li><strong>GET</strong> <code>/api/admin/adopt/booked</code>: Admin can view all booked pets.</li>
      </ul>
      
      <h3>Admin</h3>
      <ul>
        <li><strong>GET</strong> <code>/api/admin/dashboard</code>: Admin overview of pet adoption requests.</li>
      </ul>
    </div>
    
    <div id="project-structure" class="section">
      <h2>Project Structure</h2>
      <pre><code>pet-adoption-backend/
│
├── prisma/                   # Prisma schema and migration files
├── src/                      # Source code of the application
│   ├── modules/              # Features and business logic (User, Pet, Adoption)
│   ├── middleware/           # Custom middlewares (Auth, Error handling)
│   ├── shared/               # Shared files and utilities (Prisma client, constants)
│   ├── routes/               # API routes for different modules
│   ├── error/                # Error handling and custom errors
│   └── index.ts              # Main entry point
├── .env                      # Environment variables
├── Dockerfile                # Dockerfile for containerization (optional)
├── package.json              # Project metadata and dependencies
└── README.md                 # Project documentation
</code></pre>
    </div>
    
    <div id="environment-variables" class="section">
      <h2>Environment Variables</h2>
      <p>The application requires the following environment variables to function correctly:</p>
      <ul>
        <li><strong>DATABASE_URL</strong>: URL connection string for the PostgreSQL database.</li>
        <li><strong>JWT_SECRET</strong>: Secret key for JWT authentication.</li>
        <li><strong>PORT</strong>: The port on which the server will run (default: 3000).</li>
      </ul>
    </div>
    
    <div id="running-the-application" class="section">
      <h2>Running the Application</h2>
      <h3>Development Mode</h3>
      <pre><code>npm run dev</code></pre>
      
      <h3>Production Mode</h3>
      <p>Build the project before starting in production mode:</p>
      <pre><code>npm run build
npm run start</code></pre>
    </div>
    
    <div id="license" class="section">
      <h2>License</h2>
      <p>This project is licensed under the <strong>MIT License</strong>. See the <a href="LICENSE">LICENSE</a> file for more details.</p>
    </div>
  </div>
</body>
</html>
