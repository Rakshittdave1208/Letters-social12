# Security Policy

## Supported Versions

The following versions of **Letters Social** currently receive security updates.

| Version              | Supported |
| -------------------- | --------- |
| Latest (main branch) | ✅ Yes     |
| Older versions       | ❌ No      |

Security fixes and updates are only applied to the **latest version of the project**.

Users are encouraged to always run the most recent version of the codebase.

---

# Reporting a Vulnerability

If you discover a **security vulnerability** in this project, please report it responsibly so it can be addressed as quickly as possible.

We appreciate responsible disclosure that helps protect users and contributors.

---

## How to Report

You can report a security vulnerability using one of the following methods:

### 1. Open a GitHub Issue

Create an issue in this repository:

https://github.com/Rakshittdave1208/Letters-social12/issues

Please include **"Security"** in the issue title to help identify it quickly.

Example:

```
Security: Firestore rule bypass vulnerability
```

---

### 2. Contact the Maintainer

You may also contact the project maintainer directly through GitHub.

Maintainer Profile:

https://github.com/Rakshittdave1208

---

# Information to Include in the Report

To help investigate the issue efficiently, please include as much detail as possible.

Recommended information:

* Description of the vulnerability
* Steps required to reproduce the issue
* Expected behavior vs actual behavior
* Potential impact of the vulnerability
* Screenshots or proof-of-concept (if available)
* Affected file or module (if known)

Example structure:

```
Description:
A vulnerability allowing unauthorized reads from Firestore.

Steps to reproduce:
1. Navigate to the search page
2. Query Firestore endpoint directly
3. Data is returned without authentication

Impact:
Unauthorized access to user data.
```

Providing detailed reports helps resolve issues faster.

---

# Response Timeline

Security reports are typically handled according to the following timeline:

| Stage            | Expected Time       |
| ---------------- | ------------------- |
| Initial response | 48–72 hours         |
| Investigation    | 3–5 days            |
| Fix development  | As soon as possible |

Once confirmed:

1. The vulnerability will be investigated.
2. A fix will be developed.
3. The patch will be released in the next update.

---

# Responsible Disclosure

Please **do not publicly disclose security vulnerabilities** until they have been reviewed and resolved.

Responsible disclosure helps protect users of the project and prevents exploitation before a fix is available.

---

# Security Best Practices Used in This Project

This project follows several best practices to maintain application security.

### Environment Variables

Sensitive credentials such as Firebase configuration values are stored using environment variables.

Example:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
```

These values are stored in `.env` and excluded from version control using `.gitignore`.

---

### Firebase Security Rules

Firestore security rules are used to control access to database collections such as:

* posts
* users
* bookmarks
* notifications

Rules ensure that:

* Only authenticated users can write data
* Users can only modify their own data
* Unauthorized access is prevented

---

### Authentication

User authentication is handled using **Firebase Authentication**.

Supported authentication mechanisms include:

* Email / Password authentication
* Secure session handling

---

### Dependency Security

Dependencies are regularly reviewed and updated.

Security tools used include:

* `npm audit`
* GitHub Dependabot alerts

Developers should periodically run:

```
npm audit
```

to check for known vulnerabilities in dependencies.

---

### Secure Development Practices

The project follows these practices:

* No secrets stored in source code
* `.env` excluded from Git
* Input validation where applicable
* Minimal exposure of sensitive data
* Controlled Firestore access

---

# Security Scope

This security policy applies to:

* Application source code
* Firebase integration
* Authentication logic
* API and data access patterns

Issues related to **Firebase infrastructure itself** should be reported through the Firebase security channels.

---

# Maintainer

This project is maintained by:

**Rakshit Dave**

GitHub
https://github.com/Rakshittdave1208

---

# Acknowledgment

We appreciate responsible researchers and contributors who help improve the security of this project.
