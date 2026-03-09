# Letters Social

**Letters Social** is a modern **real-time social media web application** built using **React 19, TypeScript, Zustand, React Query, and Firebase**.

The platform allows users to share thoughts, interact with posts, send direct messages, follow other users, bookmark content, and receive real-time notifications — all with a beautiful dark/light mode UI.

This repository demonstrates best practices for building production-ready React applications including:

- Feature-based modular architecture
- Custom hooks for all business logic
- Real-time updates via Firebase Firestore + Realtime Database (WebSockets)
- Zustand for global state management
- React Query for server state and mutations
- Real-time presence and typing indicators

---

# Live Features

## 🏠 Feed
- Create and view text posts in a global real-time feed
- Like / unlike posts with instant UI feedback
- Skeleton loaders while content loads
- Ctrl+Enter shortcut to post quickly

## 💬 Comments
- Threaded comments per post
- Real-time typing indicators ("Rakshit is typing...")
- Add and delete comments
- Powered by Firebase Realtime Database WebSockets

## 📨 Direct Messages
- One-on-one real-time DM conversations
- Conversation list with unread badge counts
- Auto-scroll to latest message
- Start a DM from the Search page

## 🔔 Notifications
- Real-time notification bell with unread count badge
- Triggered by likes, comments, follows
- Mark individual or all notifications as read
- Dropdown panel in the sidebar

## 👥 Follow System
- Follow and unfollow users
- Real-time follower/following counts on profiles
- Follow notifications sent to target users

## 🔍 Search
- Search users by name
- Search posts by content
- Debounced input for performance
- Skeleton loaders during queries

## 👤 Profile Page
- View your posts, likes, comments, followers, following
- Beautiful cover banner with avatar
- Edit profile: change name, bio, profile photo (Firebase Storage)
- All post author names update when you rename yourself

## 🔖 Bookmarks
- Save posts to read later
- Personal bookmark collection per user
- Remove bookmarks instantly

## 📊 Analytics
- Total posts, likes, comments
- Average likes per post
- Top performing post highlighted
- Engagement tier per post: 🔥 Hot / 📈 Good / 💤 Low

## 🗑️ Delete Posts & Comments
- Trash icon appears on hover (author only)
- Inline confirm dialog before delete
- Double protection: UI guard + backend ownership check

## 🌙 Dark Mode
- Toggle between dark and light themes
- Persists across page refreshes via localStorage
- Respects OS system preference on first load

## 🟢 Online Presence
- Real-time online users list in right sidebar
- Green dot indicator
- Powered by Firebase Realtime Database `onDisconnect`

---

# Tech Stack

## Frontend
- **React 19** — component-based UI
- **TypeScript** — type-safe development
- **Vite** — fast development server and bundler
- **Tailwind CSS v4** — utility-first styling
- **React Router v6** — client-side routing with lazy loading
- **Zustand** — lightweight global state management
- **React Query (@tanstack/react-query)** — server state, mutations, caching

## Backend Services (Firebase)
- **Firebase Authentication** — email/password + Google OAuth
- **Firebase Firestore** — NoSQL cloud database for posts, comments, notifications, bookmarks, conversations
- **Firebase Realtime Database** — WebSocket-based presence and typing indicators
- **Firebase Storage** — profile photo uploads

## Testing
- **Vitest** — unit and integration tests
- **React Testing Library** — component testing
- **34 passing tests**

## Development Tools
- **Git + GitHub** — version control
- **ESLint + Prettier** — code quality and formatting

---

# Architecture

The project follows a **feature-based modular architecture** — code is organized by feature, not by file type.

Each feature owns its components, hooks, API logic, and types:

```
features/
  auth/           → login, signup, Google auth, auth store
  posts/          → feed, post card, create post, delete
  comments/       → comment section, typing indicators
  messages/       → DM conversations, chat page
  notification/   → bell, dropdown, mark read
  follow/         → follow/unfollow, counts
  profile/        → profile page, edit profile
  bookmarks/      → saved posts
  search/         → search users and posts
  analytics/      → engagement stats
```

### Custom Hooks Pattern

Every feature extracts logic into custom hooks:

| Hook | What it does |
|---|---|
| `useAuth` | Login, signup, Google auth |
| `useFollow` | Follow/unfollow, live counts |
| `useNotifications` | Real-time notification feed |
| `useConversations` | DM conversation list |
| `useChat` | Real-time messages in a chat |
| `usePresence` | Online/offline status |
| `useTypingBroadcast` | Broadcast typing to others |
| `useTypingIndicator` | Show who is typing |
| `useDarkMode` | Dark/light theme with persistence |
| `useDeletePost` | Delete post with auth check |
| `useDeleteComment` | Delete comment with auth check |

---

# Project Structure

```
letters-social/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── AppLayout.tsx         ← sidebar layout, nav, dark mode
│   │   ├── router.tsx            ← all routes with lazy loading
│   │   └── ProtectedRoute.tsx
│   │
│   ├── components/
│   │   └── ui/
│   │       ├── Skeleton.tsx
│   │       ├── Toast.tsx
│   │       └── OnlineUsers.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── hooks/useAuth.ts
│   │   │   ├── auth.store.ts
│   │   │   └── LoginPage.tsx
│   │   │
│   │   ├── posts/
│   │   │   ├── components/
│   │   │   │   ├── PostCard.tsx
│   │   │   │   └── CreatePost.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useDeletePost.ts
│   │   │   │   └── useRealtime.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── comments/
│   │   │   └── components/CommentSection.tsx
│   │   │
│   │   ├── messages/
│   │   │   ├── hooks/useMessages.ts
│   │   │   ├── MessagesPage.tsx
│   │   │   ├── ChatPage.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── notification/
│   │   │   ├── components/NotificationBell.tsx
│   │   │   ├── hooks/useNotifications.ts
│   │   │   └── notification.api.ts
│   │   │
│   │   ├── follow/
│   │   │   ├── hooks/useFollow.ts
│   │   │   └── follow.api.ts
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfilePage.tsx
│   │   │   └── EditProfilePage.tsx
│   │   │
│   │   ├── analytics/
│   │   │   └── AnalyticsPage.tsx
│   │   │
│   │   ├── bookmarks/
│   │   │   └── BookmarksPage.tsx
│   │   │
│   │   └── search/
│   │       └── SearchPage.tsx
│   │
│   ├── hooks/
│   │   ├── useDarkMode.ts
│   │   ├── usePresence.ts
│   │   └── useTyping.ts
│   │
│   ├── lib/
│   │   └── firebase.ts           ← auth, firestore, rtdb
│   │
│   └── main.tsx                  ← bootstraps auth _init()
│
├── .env
├── package.json
└── README.md
```

---

# Routes

| Path | Page | Protected |
|---|---|---|
| `/` | Feed | No |
| `/search` | Search | No |
| `/post/:id` | Post Detail | No |
| `/login` | Login / Signup | No |
| `/messages` | DM Conversations | ✅ Yes |
| `/messages/:id` | Chat | ✅ Yes |
| `/bookmarks` | Bookmarks | ✅ Yes |
| `/analytics` | Analytics | ✅ Yes |
| `/profile` | Profile | ✅ Yes |
| `/profile/edit` | Edit Profile | ✅ Yes |

---

# Installation

Clone the repository:

```bash
git clone https://github.com/Rakshittdave1208/Letters-social12.git
```

Navigate to the project directory:

```bash
cd Letters-social12
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

# Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_DATABASE_URL=
```

Get these values from: **Firebase Console → Project Settings → Web App**

The `VITE_FIREBASE_DATABASE_URL` is required for online presence and typing indicators (Firebase Realtime Database).

---

# Running Tests

```bash
npm run test           # run all tests
npm run test:ui        # run with visual UI
npm run test:coverage  # generate coverage report
```

34 tests passing across components and hooks.

---

# Future Improvements

- Image uploads for posts
- Follow suggestions algorithm
- End-to-end testing with Playwright
- CI/CD pipeline with GitHub Actions
- Deploy to Vercel
- Mobile PWA support
- Post editing
- Advanced search filters
- Emoji reactions on posts

---

# Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "add: your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

# License

This project is licensed under the **MIT License**.

---

# Author

**Rakshit Dave**

GitHub: https://github.com/Rakshittdave1208

LinkedIn: https://www.linkedin.com/in/rakshit-dave-8879ab25a/

---

# Acknowledgment

Built with inspiration from modern social platforms like Twitter and Threads. Extended using the React ecosystem including Zustand, React Query, and Firebase — demonstrating production-grade frontend architecture patterns.