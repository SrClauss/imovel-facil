# Imóvel Fácil - Real Estate Platform

A full-stack TypeScript application for real estate property management with a modern React frontend and Express.js backend.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Query** for data fetching
- **Wouter** for routing
- **React Hook Form** for form management

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations
- **PostgreSQL** for data storage
- **Passport.js** for authentication
- **Zod** for validation

## 📋 Prerequisites

- Node.js 20+
- Docker & Docker Compose (for containerized deployment)
- PostgreSQL (if running locally without Docker)

## 🐳 Docker Deployment

### Quick Start with Docker Compose

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd imovel-facil
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Build and start containers**
   ```bash
   npm run docker:build
   npm run docker:up
   ```

4. **Access the application**
   - Application: http://localhost:5000
   - Database: localhost:5432

5. **View logs**
   ```bash
   npm run docker:logs
   ```

6. **Stop containers**
   ```bash
   npm run docker:down
   ```

### Docker Commands

- `npm run docker:build` - Build Docker images
- `npm run docker:up` - Start containers in detached mode
- `npm run docker:down` - Stop and remove containers
- `npm run docker:logs` - View container logs

### Manual Docker Commands

```bash
# Build the image
docker compose build

# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Rebuild and restart
docker compose up -d --build

# Note: If using Docker Compose v1 (versions prior to Docker 20.10), use 'docker-compose' instead of 'docker compose'
```

### Development with Docker Database

For local development, you can run just the PostgreSQL database in Docker:

```bash
# Start PostgreSQL in Docker
npm run docker:dev:up

# Now run the app locally with access to the Docker database
npm run dev

# Stop the database when done
npm run docker:dev:down
```

## 💻 Local Development

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your database credentials:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/imovel_facil
   NODE_ENV=development
   PORT=5000
   ```

3. **Start PostgreSQL** (if not using Docker)
   ```bash
   # Using Docker for database only
   docker run -d \
     --name imovel-facil-db \
     -e POSTGRES_DB=imovel_facil \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -p 5432:5432 \
     postgres:16-alpine
   ```

4. **Push database schema**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:5000

## 🧪 Testing

This project includes comprehensive testing for backend, frontend, and end-to-end user flows.

### Running Tests

```bash
# Run all unit tests (backend + frontend)
npm test

# Run backend tests only
npm run test:server

# Run frontend tests only
npm run test:client

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run end-to-end tests
npm run test:e2e

# Run E2E tests with UI (interactive)
npm run test:e2e:ui

# Run all tests (unit + E2E)
npm run test:all
```

### Test Coverage

- **Backend Tests**: 17 tests (storage + routes)
- **Frontend Tests**: 23 tests (React components)
- **E2E Tests**: 50+ tests (user flows and interactions)
- **Total**: 90+ tests

### Backend Tests

Backend tests use **Vitest** and **Supertest** to test:
- Database operations (storage layer)
- API endpoints (routes)
- Business logic

Test files are located in:
- `server/storage.test.ts` - Database operations
- `server/routes.test.ts` - API endpoints

### Frontend Tests

Frontend tests use **Vitest**, **React Testing Library**, and **jsdom** to test:
- React components
- User interactions
- Component rendering

Test files are located in:
- `client/src/components/*.test.tsx` - Component tests

### End-to-End Tests

E2E tests use **Playwright** to test complete user workflows:
- Home page and property listings
- Property search and filtering
- Property details page
- Contact form submission
- Authentication flow (login/logout)
- Property management (CRUD operations)
- Responsive design and navigation

Test files are located in:
- `e2e/*.spec.ts` - End-to-end test suites

For more details on testing, see [TESTING.md](TESTING.md).

Test files are located in:
- `client/src/components/*.test.tsx` - Component tests

### Test Configuration

- `vitest.config.server.ts` - Backend test configuration
- `vitest.config.client.ts` - Frontend test configuration
- `client/src/test/setup.ts` - Test setup and utilities

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

This will:
1. Build the React frontend with Vite
2. Bundle the Express backend with esbuild
3. Output everything to the `dist/` directory

## 📁 Project Structure

```
imovel-facil/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   └── test/        # Test utilities
│   └── index.html
├── server/              # Express backend
│   ├── index.ts        # Server entry point
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Database operations
│   ├── db.ts           # Database connection
│   └── *.test.ts       # Server tests
├── shared/              # Shared code (types, schemas)
│   ├── schema.ts       # Database schema
│   └── routes.ts       # API route definitions
├── script/              # Build scripts
├── migrations/          # Database migrations
├── Dockerfile           # Docker image definition
├── docker-compose.yml   # Docker services configuration
├── .dockerignore        # Docker ignore patterns
└── package.json         # Dependencies and scripts
```

## 🗃️ Database

### Schema

The application uses PostgreSQL with the following main tables:
- **properties** - Property listings
- **contacts** - Contact form submissions
- **users** - User accounts
- **sessions** - User sessions

### Migrations

```bash
# Push schema changes to database
npm run db:push

# Generate migrations (if needed)
npx drizzle-kit generate
```

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 5000 |
| `SESSION_SECRET` | Session encryption key | Required in production |

## 📝 API Endpoints

### Properties
- `GET /api/properties` - List all properties (with filters)
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create property (authenticated)
- `PUT /api/properties/:id` - Update property (authenticated)
- `DELETE /api/properties/:id` - Delete property (authenticated)

### Contacts
- `POST /api/contacts` - Submit contact form

### Query Parameters for Listing
- `type` - Filter by type (sale/rent)
- `category` - Filter by category (house/apartment/land/commercial)
- `neighborhood` - Filter by neighborhood
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `bedrooms` - Minimum bedrooms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Docker Issues

**Container won't start:**
```bash
# Check logs
docker compose logs

# Rebuild from scratch
docker compose down -v
docker compose build --no-cache
docker compose up
```

**Database connection issues:**
- Ensure PostgreSQL container is healthy
- Check DATABASE_URL in environment
- Verify network connectivity between containers

### Local Development Issues

**Port already in use:**
```bash
# Change PORT in .env file or stop the process using the port
lsof -ti:5000 | xargs kill -9
```

**Database schema out of sync:**
```bash
# Reset and push schema
npm run db:push
```

## 📞 Support

For support, please open an issue in the repository or contact the maintainers.
