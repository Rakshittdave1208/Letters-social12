# Letters Social

A modern **social media web application** built with **React, TypeScript, Redux Toolkit, and Firebase**.
Users can create posts, interact through comments, follow other users, bookmark content, and receive real-time notifications.

This project demonstrates **modern frontend architecture**, **feature-based design**, and **real-time Firebase integration**.

---

# Features

## Core Social Features

### 📝 Posts

* Create posts
* View posts in a feed
* Post detail pages
* Like posts
* Post actions (edit / delete ready for extension)

### 💬 Comments

* Add comments to posts
* View comments in a thread
* Real-time updates
* Comment section integrated with each post

### 🔖 Bookmarks

* Save posts for later
* Personal bookmark list
* Quick access to saved posts

### 🔔 Notifications

* Real-time notification updates
* Notification bell indicator
* Notifications triggered by interactions

### 👥 Follow System

* Follow other users
* Unfollow users
* View user connections

### 🔍 Search

* Search posts
* Search users
* Discover content easily

### 👤 Profile Page

* View user profile
* Display user posts
* Bookmark collection
* User information

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Redux Toolkit
* RTK Query

## Backend / Services

* Firebase Authentication
* Firebase Firestore Database

## Testing

* Vitest
* React Testing Library

## Development Tools

* Git
* GitHub
* ESLint

---

# Architecture

The project follows a **feature-based modular architecture**.

Each feature manages its own:

* components
* hooks
* API logic
* state
* types

### Benefits

* Better scalability
* Easier maintenance
* Clear separation of concerns
* Feature independence

---

# Project Structure

```
letters-social
│
├── public
│   └── vite.svg
│
├── src
│
│   ├── app
│   │   └── layout
│
│   ├── components
│
│   ├── features
│   │
│   │   ├── auth
│   │   ├── bookmarks
│   │   ├── comments
│   │   │   └── CommentSection.tsx
│   │   │
│   │   ├── feed
│   │   │
│   │   ├── follow
│   │   │   ├── hooks
│   │   │   └── follow.api.ts
│   │   │
│   │   ├── notification
│   │   │   ├── components
│   │   │   │   └── NotificationBell.tsx
│   │   │   ├── hooks
│   │   │   │   └── useNotifications.ts
│   │   │   └── notification.api.ts
│   │   │
│   │   ├── posts
│   │   │   ├── api
│   │   │   │   └── posts.api.ts
│   │   │   │
│   │   │   ├── components
│   │   │   │   ├── CreatePost.tsx
│   │   │   │   ├── PostActions.tsx
│   │   │   │   ├── PostCard.tsx
│   │   │   │   └── PostSkeleton.tsx
│   │   │   │
│   │   │   ├── data
│   │   │   ├── hooks
│   │   │   ├── PostDetailPage.tsx
│   │   │   ├── posts.selectors.ts
│   │   │   ├── posts.store.ts
│   │   │   └── types.ts
│   │
│   │   ├── profile
│   │   │   └── ProfilePage.tsx
│   │
│   │   ├── search
│   │   │   └── SearchPage.tsx
│
│   ├── lib
│   │   └── firebase.ts
│
│   ├── pages
│   │   ├── Home.tsx
│   │   └── RouteError.tsx
│
│   ├── services
│   │   └── posts.service.ts
│
│   ├── App.tsx
│   ├── main.tsx
│   ├── App.css
│   └── index.css
│
├── .env.example
├── package.json
└── README.md
```

---

# Installation

Clone the repository:

```
git clone https://github.com/YOUR_USERNAME/letters-social.git
```

Navigate to the project directory:

```
cd letters-social
```

Install dependencies:

```
npm install
```

Start the development server:

```
npm run dev
```

The application runs at:

```
http://localhost:5173
```

---

# Environment Variables

Create a `.env` file in the root directory.

Example:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

You can obtain these values from:

**Firebase Console → Project Settings → Web App**

---

# Running Tests

Run tests:

```
npm run test
```

Run tests with UI:

```
npm run test:ui
```

Generate coverage report:

```
npm run test:coverage
```

Testing is implemented using **Vitest and React Testing Library**.

---

# Screenshots

You can add screenshots here.

Example:

* Home Feed
* Create Post
* Post Detail
* Comment Section
* Notification Bell
* Search Page
* User Profile
* Bookmarks Page

---

# Future Improvements

Planned enhancements:

* Image upload for posts
* Follow suggestions
* Real-time chat
* Dark mode
* Advanced search filters
* End-to-end testing
* CI/CD deployment pipeline

---

# Contributing

Contributions are welcome.

Steps:

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to your branch
5. Open a Pull Request

---

# License

MIT License

---

# Author

**Rakshit Dave**

GitHub
https://github.com/Rakshittdave1208

LinkedIn
(https://www.linkedin.com/in/rakshit-dave-8879ab25a/)

---

# Acknowledgment

Inspired by the book **React in Action** and extended with the modern **React ecosyste**
