import { useLocation } from "react-router-dom";

type DocumentationPageProps = {};

const DocumentationPage = ({}: DocumentationPageProps) => {
  const { hash } = useLocation();

  return (
    <section className="grid grid-cols-[300px_1fr] gap-6 -my-20">
      <aside className="sticky top-[75px] left-0 -mt-20 bg-(--color-bg) h-screen overflow-y-auto border-r-2 border-gray-600 pt-4 pb-10 px-1">
        <nav>
          <h2 className="text-xl font-bold mb-4 px-1 uppercase">
            Documentation
          </h2>
          <ul className="flex flex-col gap-4 text-gray-400">
            <li>
              <a
                href="#overview"
                className={`block py-1 px-2 rounded ${
                  hash === "#overview"
                    ? "bg-(--color-primary) text-(--color-bg) hover:text-(--color-bg)"
                    : "hover:text-(--color-text)"
                } `}
              >
                Overview
              </a>
            </li>
            <li>
              <a
                href="#features"
                className={`block py-1 px-2 rounded ${
                  hash === "#features"
                    ? "bg-(--color-primary) text-(--color-bg) hover:text-(--color-bg)"
                    : "hover:text-(--color-text)"
                } `}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#getting-started"
                className={`block py-1 px-2 rounded ${
                  hash === "#getting-started"
                    ? "bg-(--color-primary) text-(--color-bg) hover:text-(--color-bg)"
                    : "hover:text-(--color-text)"
                } `}
              >
                Getting Started
              </a>
            </li>
            <li>
              <a
                href="#user-roles"
                className={`block py-1 px-2 rounded ${
                  hash === "#user-roles"
                    ? "bg-(--color-primary) text-(--color-bg) hover:text-(--color-bg)"
                    : "hover:text-(--color-text)"
                } `}
              >
                User Roles
              </a>
            </li>
            <li>
              <a
                href="#api-guide"
                className={`block py-1 px-2 rounded ${
                  hash === "#api-guide"
                    ? "bg-(--color-primary) text-(--color-bg) hover:text-(--color-bg)"
                    : "hover:text-(--color-text)"
                } `}
              >
                API Guide
              </a>
            </li>
            <li>
              <a
                href="#about"
                className={`block py-1 px-2 rounded ${
                  hash === "#about"
                    ? "bg-(--color-primary) text-(--color-bg) hover:text-(--color-bg)"
                    : "hover:text-(--color-text)"
                } `}
              >
                About
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="overflow-x-hidden my-20">
        <h1 className="text-4xl font-bold mb-2">
          Football API Manager Documentation
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          A complete platform for{" "}
          <span className="text-(--color-primary) font-semibold">
            Managing Football Data
          </span>
          . Perfect for developers, analysts, or admins who want full control
          over structured football statistics and API data.
        </p>

        <div className="space-y-12">
          <article id="overview">
            <h2 className="text-3xl font-bold mb-2">Overview</h2>
            <p className="text-gray-400">
              Football API Manager is a centralized platform for football data.
              <b> Admins</b> can manage their data, while standard <b>users</b>{" "}
              can view statistics and analytics. The system provides secure and
              structured data access via a <b>REST API</b> with{" "}
              <b>Token-Based Authentication</b>.
            </p>
          </article>

          <article id="features">
            <h2 className="text-3xl font-bold mb-2">Features</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <b>Football Data Hub:</b>{" "}
                <span className="text-gray-400">
                  Centralized data management for clubs, players, competitions,
                  countries and stats.
                </span>
              </li>
              <li>
                <b>User & Role Management:</b>{" "}
                <span className="text-gray-400">
                  Admins can manage users and permissions; standard users have
                  secure access.
                </span>
              </li>
              <li>
                <b>RESTful API Access:</b>{" "}
                <span className="text-gray-400">
                  All endpoints are secure and scalable, with public endpoints
                  accessible for general use, enabling safe integration.
                </span>
              </li>
              <li>
                <b>API Documentation:</b>{" "}
                <span className="text-gray-400">
                  Comprehensive API reference, including Swagger (OpenAPI), for
                  easy integration and usage.
                </span>
              </li>
              <li>
                <b>Frontend UI:</b>{" "}
                <span className="text-gray-400">
                  Interactive and user-friendly interface for easy data
                  exploration and management.
                </span>
              </li>
              <li>
                <b>Secure Authentication:</b>{" "}
                <span className="text-gray-400">
                  JWT-based authentication with role-based access control.
                </span>
              </li>
            </ul>
          </article>

          <article id="getting-started">
            <h2 className="text-3xl font-bold mb-2">Getting Started</h2>
            <h3 className="text-xl font-semibold mb-1">Installation</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Clone repository: <code>git clone &lt;repo-url&gt;</code>
              </li>
              <li>
                Install backend: <code>cd server && npm install</code>
              </li>
              <li>
                Install frontend: <code>cd client && npm install</code>
              </li>
              <li>
                Run backend: <code>cd server && npm run start:dev</code>
              </li>
              <li>
                Run frontend: <code>cd client && npm run dev</code>
              </li>
            </ul>
            <h3 className="text-xl font-semibold mt-4 mb-1">
              Environment Variables
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold mb-2">
                  <i className="fas fa-server mr-1 align-middle"></i> Backend
                  (.env):
                </p>
                <pre className="bg-(--color-text)/15 p-4 rounded-lg overflow-x-auto text-sm">
                  DB_HOST=&lt;localhost&gt; DB_PORT=&lt;your_port&gt;
                  DB_USER=&lt;your_user&gt; DB_PASSWORD=&lt;your_password&gt;
                  DB_NAME=&lt;your_db_name&gt;
                  ADMIN_SECRET_KEY=&lt;your_admin_secret_key&gt;
                  JWT_SECRET=&lt;your_jwt_secret&gt;
                  CLIENT_URL=&lt;your_client_url&gt;
                </pre>
              </div>
              <div>
                <p className="font-semibold mb-2">
                  <i className="fas fa-code mr-1 align-middle"></i> Frontend
                  (.env):
                </p>
                <pre className="bg-(--color-text)/15 p-4 rounded-lg overflow-x-auto text-sm">
                  VITE_API_BASE_URL=&lt;your_backend_api_url&gt;
                </pre>
              </div>
            </div>
          </article>

          <article id="user-roles">
            <h2 className="text-3xl font-bold mb-2">User Roles</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>
                <b className="text-(--color-text)">Admin:</b> Manage clubs,
                players, competitions, countries, and users.
              </li>
              <li>
                <b className="text-(--color-text)">User:</b> View clubs,
                players, competitions, countries, and analytics.
              </li>
            </ul>
          </article>

          <article id="api-guide">
            <h2 className="text-3xl font-bold mb-1">API Guide</h2>
            <p className="text-gray-400 mb-4">
              Access comprehensive football data through the RESTful API. All
              endpoints are secured, except public ones, using{" "}
              <b>JWT authentication</b> and
              <b> role-based authorization</b> to ensure safe and controlled
              access.
            </p>
            <div className="bg-(--color-text)/15 py-3 px-4 border-l-2 border-(--color-text)/75 mb-4">
              <i className="fas fa-info-circle text-lg mr-1 align-middle"></i>
              <span className="text-gray-300">
                API requests should be prefixed with{" "}
                <code>/api/&lt;API_VERSION&gt;</code> (e.g. <code>/api/v1</code>
                ).
              </span>
            </div>

            <div className="mb-4">
              <p className="text-gray-400">Some examples endpoints:</p>
              <div className="space-y-2 mt-2">
                <pre className="bg-(--color-text)/15 p-3 rounded-lg overflow-x-auto text-sm">
                  <code>GET /api/v1/clubs</code> - Fetching all clubs
                </pre>
                <pre className="bg-(--color-text)/15 p-3 rounded-lg overflow-x-auto text-sm">
                  <code>GET /api/v1/players/:id</code> - Fetching a specific
                  player by ID
                </pre>
                <pre className="bg-(--color-text)/15 p-3 rounded-lg overflow-x-auto text-sm">
                  <code>
                    POST /api/v1/auth/register - Register a new user and receive
                    an access token
                    {"\n\n"}
                    Request Body:
                    {"\n"}
                    {`{
  "username": "user@example.com",
  "password": "password123"
}`}
                  </code>
                </pre>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-2">Clubs</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <code>GET /clubs</code> - Fetch all clubs
              </li>
              <li>
                <code>GET /clubs/:id</code> - Fetch a specific club by ID
              </li>
              <li>
                <code>POST /clubs</code> - Create a club (Admin)
              </li>
              <li>
                <code>PATCH /clubs/:id</code> - Update a club (Admin)
              </li>
              <li>
                <code>DELETE /clubs/:id</code> - Delete a club (Admin)
              </li>
              <li>
                <code>POST /clubs/create-bulk</code> - Create many clubs (Admin)
              </li>
              <li>
                <code>POST /clubs/:clubId/players/:playerId</code> - Add a
                player to a specific club (Admin)
              </li>
              <li>
                <code>DELETE /clubs/:clubId/players/:playerId</code> - Remove a
                player from a specific club (Admin)
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-4">Players</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <code>GET /players</code> - Fetch all players
              </li>
              <li>
                <code>GET /players/:id</code> - Fetch a specific player by ID
              </li>
              <li>
                <code>POST /players</code> - Create player (Admin)
              </li>
              <li>
                <code>PATCH /players/:id</code> - Update player (Admin)
              </li>
              <li>
                <code>DELETE /players/:id</code> - Delete player (Admin)
              </li>
              <li>
                <code>POST /players/create-bulk</code> - Create many players
                (Admin)
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-4">Competitions</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <code>GET /competitions</code> - Fetch competitions
              </li>
              <li>
                <code>GET /competitions/:id</code> - Fetch a specific
                competition by ID
              </li>
              <li>
                <code>POST /competitions</code> - Create competition (Admin)
              </li>
              <li>
                <code>PATCH /competitions/:id</code> - Update competition
                (Admin)
              </li>
              <li>
                <code>DELETE /competitions/:id</code> - Delete competition
                (Admin)
              </li>
              <li>
                <code>POST /competitions/create-bulk</code> - Create many
                competitions (Admin)
              </li>
              <li>
                <code>POST /competitions/:competitionId/clubs/:clubId</code> -
                Add a club to a specific competition (Admin)
              </li>
              <li>
                <code>DELETE /competitions/:competitionId/clubs/:clubId</code> -
                Remove a club from a specific competition (Admin)
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-4">Countries</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <code>GET /countries</code> - Fetch countries
              </li>
              <li>
                <code>GET /countries/:id</code> - Fetch a specific country by ID
              </li>
              <li>
                <code>POST /countries</code> - Create country (Admin)
              </li>
              <li>
                <code>PATCH /countries/:id</code> - Update country (Admin)
              </li>
              <li>
                <code>DELETE /countries/:id</code> - Delete country (Admin)
              </li>
              <li>
                <code>POST /countries/create-bulk</code> - Create many countries
                (Admin)
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-4">Authentication</h3>
            <p className="text-gray-400 mb-1">
              Use <code>Authorization: Bearer &lt;token&gt;</code> for protected
              routes
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <code>POST /auth/login</code> - Login and get an access token
              </li>
              <li>
                <code>POST /auth/register</code> - Register user
              </li>
            </ul>
          </article>

          <article id="about">
            <h2 className="text-3xl font-bold mb-2">About</h2>
            <p className="text-gray-400 mb-4">
              The <b>Football API Manager</b> is a full-stack application
              designed to provide structured, secure, and easily accessible
              football data. It offers both a modern frontend for management and
              visualization, and a scalable backend exposing a RESTful API.
            </p>

            <div className="bg-(--color-text)/15 py-3 px-4 border-l-2 border-(--color-text)/75 mb-4">
              <p className="text-gray-300">
                <i className="fa-solid fa-info-circle text-lg mr-1 align-middle"></i>{" "}
                Built for developers, analysts, and admins who want a unified
                environment for managing football data with precision and
                flexibility.
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-1">
              <i className="fa-solid fa-laptop-code text-lg mr-1 align-middle"></i>
              Technologies Used
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <b>Frontend:</b>{" "}
                <span className="text-gray-400">
                  <b>React</b>, <b>TypeScript</b>, <b>Tailwind CSS</b>,{" "}
                  <b>Vite</b>
                </span>
              </li>
              <li>
                <b>Backend:</b>{" "}
                <span className="text-gray-400">
                  <b>NestJS</b>
                </span>
              </li>
              <li>
                <b>Database:</b>{" "}
                <span className="text-gray-400">
                  <b>PostgreSQL</b> (with <b>TypeORM</b> for ORM and data
                  persistence)
                </span>
              </li>
              <li>
                <b>Authentication:</b>{" "}
                <span className="text-gray-400">
                  <b>JWT</b>-based authentication with role-based access control
                  (<b>RBAC</b>)
                </span>
              </li>
              <li>
                <b>Documentation:</b>{" "}
                <span className="text-gray-400">
                  <b>Swagger (OpenAPI)</b> integrated for API reference
                </span>
              </li>
              <li>
                <b>Containerization:</b>{" "}
                <span className="text-gray-400">
                  <b>Docker</b> for consistent local development and deployment
                  environments
                </span>
              </li>
              <li>
                <b>Deployment:</b>{" "}
                <span className="text-gray-400">
                  Configurable for platforms like <b>Render</b>, <b>Netlify</b>,
                  or Docker-based servers
                </span>
              </li>
            </ul>
          </article>
        </div>
      </main>
    </section>
  );
};

export default DocumentationPage;
