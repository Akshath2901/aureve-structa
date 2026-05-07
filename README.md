# 🏠 Aureve-Structa — Real Estate & Construction Platform

Aureve-Structa is a full-stack monorepo consisting of two interconnected web applications — **Aureve** (Real Estate Platform) and **Structa** (Construction Services Platform) — built with Next.js, TypeScript, and PostgreSQL. Both applications are cross-navigable, sharing a unified backend and database infrastructure within a pnpm workspace.

🔗 **Live Demo:** [aureve-app.vercel.app](https://aureve-app.vercel.app)

---

## 📸 Screenshots
> Add screenshots of Aureve property listings, Structa dashboard, and admin panels here

---

## 🏗️ Architecture Overview

This is a **pnpm monorepo** containing two Next.js applications that are interlinked and can navigate between each other seamlessly.

```
aureve-structa/
├── apps/
│   ├── aureve/       # Real Estate Platform (Next.js + TypeScript)
│   └── structa/      # Construction Services Platform (Next.js + TypeScript)
├── package.json
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

---

## 🌐 Applications

### 🏡 Aureve — Real Estate Platform

A full-featured real estate marketplace with multi-role access control.

**Features:**
- 🏘️ **Property Listings** — Browse, search, and filter properties by location, price, and type
- 🔄 **Cross-Navigation** — Seamlessly navigate to Structa for construction services
- 🔐 **Role-Based Access Control** across 3 user types:

| Role | Access |
|---|---|
| **Buyer** | Browse listings, shortlist properties, contact sellers |
| **Seller** | List properties, manage listings, track buyer interest |
| **Admin** | Manage all users, listings, and platform operations |

---

### 🏗️ Structa — Construction Services Platform

A construction services companion to Aureve, helping users plan and manage construction projects.

**Features:**
- 🔨 **Construction Services** — Browse and request construction and renovation services
- 🔄 **Cross-Navigation** — Linked to Aureve for end-to-end property-to-construction workflow
- 📋 **Staff/Operations Panel** — Manage service requests, assignments, and project status

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | [Add — Prisma / Drizzle] |
| Styling | Tailwind CSS / CSS |
| Package Manager | pnpm (workspace monorepo) |
| Authentication | [Add — NextAuth / Clerk / JWT] |
| Deployment | Vercel |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/Akshath2901/aureve-structa.git
cd aureve-structa

# Install all dependencies across both apps
pnpm install
```

### Environment Variables

Create `.env` files in each app directory:

**apps/aureve/.env**
```env
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

**apps/structa/.env**
```env
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3001
```

### Running the Apps

```bash
# Run Aureve (Real Estate)
cd apps/aureve
pnpm dev

# Run Structa (Construction) — in a new terminal
cd apps/structa
pnpm dev
```

- Aureve runs on `http://localhost:3000`
- Structa runs on `http://localhost:3001`

---

## 🔐 Role-Based Access Summary

| Platform | Role | Access |
|---|---|---|
| Aureve | Buyer | Property search, shortlisting, seller contact |
| Aureve | Seller | List and manage properties, track interest |
| Aureve | Admin | Full platform management and oversight |
| Structa | Staff/Ops | Manage service requests and project assignments |

---

## 🔗 Cross-Platform Navigation

Aureve and Structa are designed to work together — a user browsing a property on Aureve can directly navigate to Structa to explore construction or renovation services for that property, creating a seamless end-to-end real estate experience.

---

## 🙋‍♂️ Author

**Togari Akshath**
- GitHub: [@Akshath2901](https://github.com/Akshath2901)
- LinkedIn: [akshath-togari](https://www.linkedin.com/in/akshath-togari-64684b317/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
