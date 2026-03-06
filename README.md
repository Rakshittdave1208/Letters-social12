# Letters Social

**Letters Social** is a modern **real-time social media web application** built using **React, TypeScript, Redux Toolkit, and Firebase**.

The platform allows users to share thoughts, interact with posts, follow other users, bookmark content, and receive real-time notifications. The project focuses on **scalable frontend architecture**, **feature-based modular design**, and **real-time cloud integration using Firebase**.

This repository demonstrates best practices for building production-ready React applications including:

* Modular architecture
* State management with Redux Toolkit
* Real-time database updates
* Feature isolation
* Modern developer tooling

---

# Application Overview

Letters Social provides a simplified social media experience similar to platforms like Twitter or Threads. Users can create posts, interact with other users' content, and manage their own activity through a profile page.

The application is designed with scalability in mind, using a **feature-based architecture** where each feature maintains its own logic, UI components, and state management.

---

# Key Features

## Posts

Users can share text-based posts that appear in a global feed.

Capabilities include:

* Create new posts
* View posts in a feed
* Navigate to detailed post pages
* Like posts
* Delete posts
* Expandable architecture for editing posts

Posts are stored in **Firebase Firestore**, enabling near real-time updates across users.

---

## Comments

Each post supports a comment thread where users can participate in discussions.

Comment features include:

* Add comments to posts
* View threaded comments
* Real-time updates
* Integrated comment section per post

The comment system is designed for **low latency interaction using Firestore listeners**.

---

## Bookmarks

Users can save posts to read later.

Features:

* Bookmark any post
* Access personal bookmark collection
* Remove bookmarks
* Persistent bookmark storage

Bookmarks are stored per user in Firestore.

---

## Notifications

Letters Social includes a simple real-time notification system.

Notification capabilities:

* Real-time updates
* Notification bell indicator
* Trigger notifications from interactions
* Centralized notification state

Notifications demonstrate how **event-based updates** can be implemented using Firebase.

---

## Follow System

Users can follow other users in the platform.

Follow system includes:

* Follow users
* Unfollow users
* View connections
* Relationship tracking

This feature demonstrates **user relationship modeling in Firestore**.

---

## Search

The application supports content discovery through search.

Search features include:

* Search posts by text
* Search users by name
* Debounced search input
* Loading skeletons during queries

Search functionality is implemented using **Firestore queries and client-side filtering**.

---

## Profile Page

Each user has a personal profile.

Profile features include:

* Display user information
* View user posts
* Bookmark collection
* Activity overview

The profile page aggregates user-related data from multiple Firestore collections.

---

# Tech Stack

## Frontend

Core technologies used in the user interface:

* **React 18** – component-based UI library
* **TypeScript** – type-safe JavaScript development
* **Vite** – lightning fast development server and bundler
* **Redux Toolkit** – simplified state management
* **RTK Query** – data fetching and caching
* **Tailwind CSS** – utility-first styling

---

## Backend Services

Backend functionality is provided by **Firebase**.

Services used:

* **Firebase Authentication** – user authentication
* **Firebase Firestore** – NoSQL cloud database
* **Realtime updates** – Firestore listeners

Firebase allows the project to function without a traditional backend server.

---

## Testing

Testing tools used:

* **Vitest**
* **React Testing Library**

Testing ensures reliability for UI components and business logic.

---

## Development Tools

The project uses modern development tooling:

* **Git** – version control
* **GitHub** – repository hosting
* **ESLint** – code quality enforcement
* **Prettier** – code formatting

---

# Application Architecture

The project follows a **feature-based modular architecture**.

Instead of organizing files by type (components, hooks, etc.), the application organizes code by **features**.

Each feature contains everything it needs:

* UI components
* API logic
* hooks
* state
* types

Example:

```
features/posts
features/profile
features/search
features/auth
```

This structure provides several benefits:

* Better scalability
* Clear feature boundaries
* Easier onboarding for developers
* Improved maintainability
* Reduced coupling between modules

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
│   │   └── reusable UI components
│
│   ├── features
│   │
│   │   ├── auth
│   │   │   └── authentication logic
│   │   │
│   │   ├── bookmarks
│   │   │   └── bookmark system
│   │   │
│   │   ├── comments
│   │   │   └── CommentSection.tsx
│   │   │
│   │   ├── feed
│   │   │   └── home feed logic
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
git clone https://github.com/Rakshittdave1208/Letters-social12.git
```

Navigate to the project directory:

```
cd Letters-social12
```

Install dependencies:

```
npm install
```

Start the development server:

```
npm run dev
```

The application will run at:

```
http://localhost:5173
```

---

# Environment Variables

Create a `.env` file in the root directory.

Example configuration:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

These values can be obtained from:

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

You can include screenshots of the application here.

Recommended sections:

* Home Feed
* Create Post
* Post Detail Page
* Comment Section
* Notification Bell
* Search Page
* Profile Page
* Bookmarks Page

---

# Future Improvements

Possible enhancements for the platform:

* Image uploads for posts
* Follow suggestions algorithm
* Real-time chat system
* Dark mode toggle
* Advanced search filters
* End-to-end testing
* CI/CD deployment pipeline
* Mobile PWA support

---

# Contributing

Contributions are welcome.

Steps to contribute:

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# License

This project is licensed under the **MIT License**.

---

# Author

**Rakshit Dave**

GitHub
https://github.com/Rakshittdave1208

LinkedIn
https://www.linkedin.com/in/rakshit-dave-8879ab25a/

---

# Acknowledgment

This project was inspired by concepts from the book **React in Action** and extended using modern tools from the **React ecosystem** including Redux Toolkit, RTK Query, and Firebase.
