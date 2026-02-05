# Playory Frontend

The frontend application for **Playory**, a modern, drag-and-drop game backlog manager.

## ✨ Features

- **Kanban Board**: Drag-and-drop interface to manage game status (Backlog, Playing, Completed, etc.).
- **Game Library**: Searchable grid/list view of your entire collection.
- **IGDB Search**: Integrated search to find and add games instantly.
- **Dashboard**: Statistics and visualization of your gaming habits.
- **Dark Mode**: Toggleable theme with persistent preference.
- **Responsive**: Optimised for desktop and tablet usage.

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charting**: [Recharts](https://recharts.org/)

## 📂 Project Structure

```
playory-fe/
├── src/
│   ├── components/  # Reusable UI components (GameCard, Navbar, etc.)
│   ├── context/     # React Context (ThemeContext)
│   ├── hooks/       # Custom React hooks
│   ├── pages/       # Route pages (Board, Library, Login)
│   ├── services/    # API client configuration
│   └── store/       # Redux slices and store setup
```

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+

### 1. Installation

Navigate to the directory and install dependencies:

```bash
cd playory-fe
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Make sure `VITE_API_BASE_URL` points to your backend (default: `http://localhost:8080/api/v1`).

### 3. Run Locally

Start the development server:

```bash
npm run dev
```

The app will run at `http://localhost:5173`.

## 📜 Scripts

- `npm run dev`: Start dev server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build locally

## 🎨 Theming

This project uses Tailwind CSS v4.

- **Dark Mode**: Handled via a custom variant in `src/index.css`.
- **Colors**: Custom semantic palette (Purple/Pink/Blue gradients).
