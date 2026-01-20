# GameHub 🎮

GameHub is a modern, fullstack web application for discovering, purchasing, and managing your video game library. Built with Next.js, TypeScript, Supabase, and a clean, responsive UI, GameHub offers a seamless experience for gamers and developers alike.

---

## 🚀 Features

- **User Authentication:** Secure login and registration with NextAuth.js and Supabase.
- **Game Store:** Browse, search, and view detailed information about games.
- **Cart System:** Add, remove, and manage games in your cart with instant UI updates.
- **Checkout & Orders:** Place orders and view your complete purchase history.
- **Personal Library:** Access all purchased games in your library.
- **Responsive Design:** Fully optimized for desktop, tablet, and mobile devices.
- **Robust Error Handling:** User-friendly error messages and loading states.
- **Secure Backend:** All sensitive operations handled server-side with Supabase RLS and service_role key.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/), [React Context API](https://react.dev/reference/react/useContext)
- **Backend:** [Supabase](https://supabase.com/) (Postgres, Auth, RLS)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Hosting:** [Vercel](https://vercel.com/)

---

## 📦 Getting Started

### 1. **Clone the repository**

```bash
git clone https://github.com/your-username/gamehub.git
cd gamehub
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Set up environment variables**

Create a `.env` file in the root directory and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXTAUTH_SECRET=your_nextauth_secret
```

> **Note:** Never commit your `.env` file. All secrets should be set in your deployment platform (e.g., Vercel).

### 4. **Run the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🏗️ Project Structure

```
src/
  app/                # Next.js app directory (pages, layouts, routes)
  components/         # Reusable UI components (Navbar, Carousel, Auth, etc.)
  context/            # React Context providers (CartContext, etc.)
  actions/            # Server actions (cart, orders, auth)
  lib/                # Supabase client and utility functions
  styles/             # Tailwind and global styles
public/               # Static assets (favicon, images)
.env                  # Environment variables (not committed)
```

---

## 🔒 Security & Best Practices

- **Service Role Key:** Only used server-side, never exposed to the client.
- **RLS:** Row Level Security enforced for all user data.
- **Input Validation:** All user input is validated both client- and server-side.
- **.env in .gitignore:** Secrets are never committed to the repository.

---

## 🧪 Testing & QA

- Manual QA performed on all major browsers and devices.
- Run `npm run build` to ensure production readiness.
- (Optional) Add unit and integration tests for critical business logic.

---

## 🚀 Deployment

1. **Push your code to GitHub (or your Git provider).**
2. **Set environment variables in your deployment platform (e.g., Vercel).**
3. **Deploy!**

---

## 🙋‍♂️ Author

**Manuel Francisco Venegas**  
LinkedIn: www.linkedin.com/in/manuel-francisco-venegas

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 💡 Inspiration

GameHub was built as a modern, fullstack demonstration of best practices in web development, security, and user experience.

---

> **Questions or feedback?**  
> Open an issue or reach out!
