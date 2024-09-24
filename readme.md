<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>

  <h1>Pet Adoption Project - Backend</h1>

  <h2>Project Description</h2>
  <p>This is the backend service for the Pet Adoption platform. It handles user registration, pet management, adoption requests, and admin functionalities. The system supports different user roles such as Admin, Publisher, and Adopter.</p>

  <h2>Technologies Used</h2>
  <ul>
    <li>Node.js</li>
    <li>Express.js</li>
    <li>Prisma ORM</li>
    <li>PostgreSQL</li>
    <li>TypeScript</li>
  </ul>

  <h2>Features</h2>
  <ul>
    <li>User Authentication and Authorization</li>
    <li>Pet management (CRUD operations for Pets)</li>
    <li>Adoption request and approval flow</li>
    <li>Admin controls for managing users and pets</li>
    <li>Soft deletion of records for data recovery</li>
  </ul>

  <h2>Installation</h2>
  <ol>
    <li>Clone the repository:
      <pre><code>git clone https://github.com/sakibmohammad79/pet-adoption-server.git</code></pre>
    </li>
    <li>Navigate to the project directory:
      <pre><code>cd pet-adoption-server</code></pre>
    </li>
    <li>Install dependencies:
      <pre><code>yarn install</code></pre>
    </li>
    <li>Set up environment variables by creating a <code>.env</code> file with the necessary configuration such as the database URL.</li>
    <li>Run database migrations:
      <pre><code>npx prisma migrate dev</code></pre>
    </li>
    <li>Start the server:
      <pre><code>yarn dev</code></pre>
    </li>
  </ol>

  <h2>API Endpoints</h2>
  <ul>
    <li><strong>GET /pets</strong> - Retrieve all pets</li>
    <li><strong>POST /pets</strong> - Create a new pet</li>
    <li><strong>PUT /pets/:id</strong> - Update pet information</li>
    <li><strong>DELETE /pets/:id</strong> - Soft delete a pet</li>
    <li><strong>POST /adoptions</strong> - Request pet adoption</li>
    <li><strong>PUT /adoptions/:id/accept</strong> - Admin accepts adoption</li>
  </ul>

  <h2>Contributing</h2>
  <p>Feel free to fork this repository and submit pull requests for any enhancements or bug fixes.</p>

  <h2>License</h2>
  <p>This project is licensed under the MIT License.</p>

</body>
</html>
