# Letters Social

A modern social media web application built with **React** inspired by the project from *React in Action*.
The platform allows users to create posts, interact with others, bookmark content, search users/posts, and receive real-time notifications.

---

# 🚀 Features

### Core Features

* 📝 Create and share posts
* ❤️ Like posts and interact with other users
* 🔔 Real-time notifications
* 🔐 Secure user authentication
* ⚡ Optimized state management with Redux Toolkit
* 🔄 Real-time database integration with Firebase
* 🧪 Testing with React Testing Library & Vitest

---

### Social Interaction Features

* 💬 **Comments System**

  * Add comments on posts
  * View discussion threads
  * Real-time comment updates

* 🔖 **Bookmarks**

  * Save posts for later reading
  * Personal bookmark collection
  * Quick access to saved content

---

### Discovery Features

* 🔍 **Search Page**

  * Search posts
  * Search users
  * Fast filtering of content

---

### User Features

* 👤 **User Profile**

  * Profile page for each user
  * Display user posts
  * Bookmark list
  * Profile information

---

# 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Redux Toolkit
* RTK Query
* Vite

### Backend / Services

* Firebase Authentication
* Firebase Firestore

### Testing

* Vitest
* React Testing Library

### Version Control

* Git & GitHub

---

# 📂 Project Structure

```
letters-social
│
├── src
│   │
│   ├── components
│   │   ├── PostCard.tsx
│   │   ├── CommentSection.tsx
│   │   ├── BookmarkButton.tsx
│   │   └── SearchBar.tsx
│   │
│   ├── pages
│   │   ├── HomePage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── BookmarksPage.tsx
│   │
│   ├── features
│   │   ├── posts
│   │   ├── comments
│   │   ├── bookmarks
│   │   └── notifications
│   │
│   ├── hooks
│   │   ├── useCreatePost.ts
│   │   ├── useBookmarks.ts
│   │   └── useComments.ts
│   │
│   ├── lib
│   │   └── firebase.ts
│   │
│   ├── store
│   │   └── store.ts
│   │
│   ├── test
│   │   └── setup.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── public
├── package.json
└── README.md
```

---

# ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/letters-social.git
```

Navigate to the project folder:

```bash
cd letters-social
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The app will run at:

```
http://localhost:5173
```

---

# 🔐 Firebase Setup

1. Open Firebase Console
2. Create a new project
3. Enable **Authentication**
4. Enable **Cloud Firestore**
5. Add your Firebase configuration inside:

```
src/lib/firebase.ts
```

Example configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
}
```

---

# 🧪 Running Tests

Run all tests:

```bash
npm run test
```

Run tests with UI:

```bash
npm run test:ui
```

Run coverage report:

```bash
npm run test:coverage
```

Testing tools used:

* React Testing Library
* Vitest

---

# 📸 Screenshots

Add screenshots of your application here.

Example sections:

```
Home Feed
Create Post
Search Page
User Profile
Bookmarks
Comments Section
Notifications
```

---

# 📈 Future Improvements

* Follow / Unfollow users
* Real-time chat system
* Image upload for posts
* Post sharing
* Dark mode UI
* Deployment with CI/CD
* End-to-end testing with Playwright

---

# 📚 Learning Source

This project is inspired by the book **React in Action** and extended with modern technologies such as Redux Toolkit, Firebase, and modern testing frameworks.

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Submit a pull request

---

# 📄 License

MIT License

---

# 👨‍💻 Author

**Rakshit Dave**

GitHub: https://github.com/Rakshittdave1208
LinkedIn: Add your LinkedIn profile here
