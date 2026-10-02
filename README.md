# ShopSphere MERN Project

ShopSphere is an e-commerce application built with React, Express, MongoDB, and Mongoose.

The project has two applications:

- `client`: React frontend powered by Vite
- `server`: Express and MongoDB backend

## Requirements

Install these before starting:

- Node.js 18 or newer
- npm
- MongoDB Atlas or a local MongoDB server
- A Cloudinary account for product image uploads
- A Resend account/API key for password-reset emails

## Project Structure

```text
mern_project/
  client/                 React and Vite frontend
  server/                 Express API and MongoDB backend
  README.md
```

Important server folders:

- `controllers/`: request and business logic
- `models/`: MongoDB/Mongoose models
- `routes/`: API route definitions
- `middleware/`: authentication and file-upload middleware
- `utils/`: Cloudinary, email, and password-reset helpers

## Installation

Open PowerShell in the project root:

```powershell
cd "D:\Task\React\07. Project\mern_project"
```

Install frontend dependencies:

```powershell
cd client
npm install
```

Install backend dependencies:

```powershell
cd ..\server
npm install
```

## Environment Variables

Create this file:

```text
server/.env
```

Use your own values. Do not commit this file or share its secrets.

```env
PORT=5000
DATABASE_URL=mongodb_connection_string
SESSION_SECRET=long_random_session_secret
RESEND_API=resend_api_key
```

`DATABASE_URL` must point to the MongoDB database used by the application. The backend stores login sessions in MongoDB using `connect-mongo`.

Product uploads use Cloudinary through `server/utils/cloudinary.js`. For production, move the Cloudinary credentials in that file into environment variables before deployment.

## Run the Application

Start the backend in terminal 1:

```powershell
cd "D:\Task\React\07. Project\mern_project\server"
node index.js
```

For automatic restart while developing, use:

```powershell
cd "D:\Task\React\07. Project\mern_project\server"
npx nodemon index.js
```

The API runs at:

```text
http://localhost:5000
```

Start the frontend in terminal 2:

```powershell
cd "D:\Task\React\07. Project\mern_project\client"
npm run dev
```

The Vite frontend normally runs at:

```text
http://localhost:5173
```

Open the frontend URL in a browser. The backend CORS configuration currently allows `http://localhost:5173`.

## Production Client Build

Build the React client:

```powershell
cd "D:\Task\React\07. Project\mern_project\client"
npm run build
```

Preview the production build locally:

```powershell
npm run preview
```

Run the client lint check:

```powershell
npm run lint
```

The server package does not currently define a production or test script. Start it with `node index.js` or use a process manager in production.

## Create an Admin Account

There is no public admin registration page or admin signup route. Create admins only from the backend terminal using `server/createAdmin.js`.

Command format:

```powershell
cd "D:\Task\React\07. Project\mern_project\server"
node createAdmin.js <username> <email> <phone> <password>
```

Example:

```powershell
node createAdmin.js admin admin@example.com 9876543210 Admin@12345
```

Then log in through:

```text
http://localhost:5173/auth/login
```

Use the email and password passed to `createAdmin.js`. The account is stored with the `admin` role and can access `/admin/dashboard`.

If the command reports `Email or username already exists`, use a different username/email or update the existing account directly in MongoDB. The script does not overwrite an existing user.

Normal public registration creates regular users only. Never put admin credentials in frontend code.

## Main Frontend Pages

Public shopping pages:

- `/shop/home`
- `/shop/listing`
- `/shop/about`
- `/shop/contact`
- `/shop/search`
- `/shop/:id` for product details
- `/shop/cart`
- `/shop/wishlist`
- `/shop/checkout`

Authentication pages:

- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`

Admin pages:

- `/admin/dashboard`
- `/admin/products`
- `/admin/orders`

Admin pages are protected by the frontend admin guard and backend session/role middleware.

## Main API Groups

Authentication:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/forgot-password/send-otp`
- `POST /auth/forgot-password/verify`
- `POST /auth/forgot-password/reset`

User:

- `GET /api/user/me`
- `POST /api/user/address`
- `PUT /api/user/address/:id`
- `DELETE /api/user/address/:id`

Cart:

- `GET /api/cart`
- `POST /api/cart/add`
- `PUT /api/cart/update`
- `DELETE /api/cart/remove`
- `DELETE /api/cart/clear`

Orders:

- `POST /api/orders`
- `GET /api/orders`
- Admin order endpoints are under `/api/admin/orders`.

Products:

- Public product/search/filter endpoints are mounted under `/products`.
- Admin product create, list, update, and delete endpoints are protected by login and admin middleware.

## Authentication Behavior

- Login creates an Express session stored in MongoDB.
- The browser sends the session cookie using `credentials: "include"`.
- The frontend stores a non-sensitive user summary in `localStorage` for navigation state.
- Logout destroys the server session and clears the frontend user state.
- Cart, wishlist, and checkout pages redirect unauthenticated users to Login when authentication is required.
- After login, the frontend returns the user to the requested page when a return location was provided.

## Troubleshooting

### Backend will not start

Check that:

- You are running the command from `server`.
- `server/.env` exists.
- `DATABASE_URL` is valid.
- MongoDB is reachable.
- Port `5000` is available.

### Frontend cannot call the API

Check that both applications are running and that:

- Frontend is using `http://localhost:5173`.
- Backend is using port `5000`.
- CORS allows the frontend origin.
- Requests that need a session use `credentials: "include"`.

### Admin dashboard redirects away

Confirm that the account was created with:

```powershell
node createAdmin.js <username> <email> <phone> <password>
```

Then log out, log in again with the admin credentials, and open:

```text
http://localhost:5173/admin/dashboard
```

An existing account error means the username or email already exists. That existing MongoDB record must have `role: "admin"` to pass the admin guard.

### Password reset emails do not send

Check that `RESEND_API` is set correctly in `server/.env` and that the Resend account allows the configured sender.

## Security Notes

- Keep `.env` files out of Git.
- Replace any credentials that may have been exposed in source files.
- Move Cloudinary credentials from source code into environment variables.
- Use a strong random `SESSION_SECRET`.
- Use HTTPS and secure cookies in production.
- Restrict CORS to the real production frontend origin.
- Never allow the public registration endpoint to accept an admin role.
