# Kanban Board

A modern Kanban board application built with Next.js and TypeScript, featuring a beautiful and responsive UI with drag-and-drop functionality.

## Features

- 🎯 Drag and drop tasks between columns
- 📝 Create, edit, and delete tasks
- ✅ Add and manage subtasks
- 🏷️ Task status management
- 💾 Persistent storage using localStorage
- 📱 Responsive design
- 🎨 Modern UI with animations

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Phosphor Icons

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Dammyjay93/kanban.git
cd kanban
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
  ├── app/
  │   ├── components/
  │   │   ├── kanban-board.tsx
  │   │   ├── kanban-column.tsx
  │   │   ├── kanban-card.tsx
  │   │   ├── task-drawer.tsx
  │   │   ├── tab-selector.tsx
  │   │   └── view-switcher.tsx
  │   ├── layout.tsx
  │   └── page.tsx
  └── ...
```

## Contributing

Feel free to submit issues and enhancement requests!
