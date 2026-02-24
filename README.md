# 💬 LiveChat — Real‑Time Chat Application

🌐 **Live Demo:** [https://live-chat-nextjs-webapp.vercel.app/](https://live-chat-nextjs-webapp.vercel.app/)

LiveChat is a modern real‑time messaging web application built with the latest web technologies. It provides secure authentication, instant messaging, responsive UI, and a smooth user experience.

---

## 🚀 Tech Stack

- **Next.js** — Full‑stack React framework
- **Tailwind CSS** — Utility‑first styling
- **Clerk** — Authentication & user management
- **Convex** — Real‑time backend & database
- **Zod** — Schema validation
- **react-hot-toast** — Notifications
- **next-themes** — Dark/Light mode support

---

## ✨ Features

### 🔐 Authentication

- Secure sign up & login using Clerk
- Persistent user sessions
- User profile with avatar
- Logout functionality

### 💬 Real‑Time Chat

- Instant messaging with real‑time updates (Convex)
- One‑to‑one chat interface
- Message timestamps
- Auto‑scroll to latest messages

### 🟢 User Experience

- Responsive design (mobile + desktop)
- Modern chat UI similar to popular messaging apps
- Loading states for better UX
- Error handling with toast notifications

### 🌗 Theme Support

- Dark mode & Light mode
- Theme persistence across sessions
- Smooth theme switching using next‑themes

### 🧑‍💻 Profile Features

- User avatar display
- Edit profile options (name/image)
- Dropdown menu with account actions

### 🔔 Notifications

- Success and error messages using react‑hot‑toast
- Action feedback for user operations

### 🛡️ Data Validation

- Input validation using Zod
- Safe form handling
- Prevention of invalid data submission

---

## 🏗️ Project Structure (Simplified)

```
/app
  /chat        → Chat pages & components
  /auth        → Authentication pages
/components    → Reusable UI components
/convex        → Backend functions & schema
/lib           → Utilities & helpers
/public        → Static assets
```

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```
git clone <your-repo-url>
cd livechat
```

### 2️⃣ Install Dependencies

```
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env.local` file and add:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
CLERK_ISSUER_URL=your_issuer_url

NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

### 4️⃣ Run the Development Server

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment

The application is deployed on **Vercel**.

🔗 [https://live-chat-nextjs-webapp.vercel.app/](https://live-chat-nextjs-webapp.vercel.app/)

To deploy your own version:

1. Push the project to GitHub
2. Import the repository into Vercel
3. Add environment variables
4. Deploy

---

## 🔮 Future Improvements

- Group chat support
- File & image sharing
- Online/offline user status
- Typing indicators
- Message reactions
- Push notifications

---

## 📄 License

This project is for educational and portfolio purposes.

---

## 🙌 Acknowledgements

Built using modern full‑stack tools to demonstrate real‑time application development with Next.js.

---

⭐ If you like this project, consider giving it a star!
