# Corner Shelf Pro

A polished personal book collection manager built with Express, EJS, Mongoose, and MongoDB Atlas. Designed for Vercel deployment with database connection handling and helpful error pages.

## Features

- Responsive premium bookstore-inspired interface
- Collection dashboard: book count, collection value, genres, currently reading
- Search by title/author, genre filter, and sorting
- Add, edit, and delete books
- Optional cover image URL, descriptions, and reading status
- MongoDB connection is awaited before handling requests
- Serverless-compatible Vercel entry point and cached database connection
- Safe seed script: adds sample books only when the collection is empty

## Setup locally

1. Install Node.js 18 or newer.
2. Copy `.env.example` to `.env`.
3. Set `MONGO_URI` to your MongoDB Atlas connection string.
4. Install and run:

   ```bash
   npm install
   npm start
   ```

5. Open `http://localhost:3000`.

Optional sample data (only inserts if the collection is empty):

```bash
npm run seed
```

## MongoDB Atlas notes

- Create a database user with a password you know.
- Use the exact URI provided by Atlas under **Connect → Drivers**.
- Replace `<db_username>` and `<db_password>`; URL-encode special characters in the password.
- Ensure Atlas Network Access permits the deployment to connect. `0.0.0.0/0` allows all IPs and is less secure; prefer restricted access when practical.
- Keep `.env` out of Git and never share connection strings.

## Deploy to Vercel

1. Push this project to a new GitHub repository.
2. Import the repository in Vercel.
3. In **Settings → Environment Variables**, add `MONGO_URI` for Production (and Preview if needed).
4. Deploy. The Vercel function entry is `api/index.js`.
5. Visit `/api/health` to confirm the app can connect to MongoDB.

## Important

This is a starter application, not a substitute for authentication. Anyone who can access the deployed site can use its book management features. Add authentication before storing private or sensitive information.