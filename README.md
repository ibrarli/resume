# 📄 Apen Resume `v1.0.1`

> **The Artist of System Design — Real-Time Resume Generation Engine**

Apen Resume is a real-time, interactive resume builder engine designed to simplify professional CV creation. Built with a minimalist UI/UX philosophy, it features a split-screen workspace offering a live editable structured form panel on the left and a pixel-perfect, A4-rendered document blueprint on the right.

---

## 🛠️ System Architecture & Tech Stack

* **Framework:** React 19 (Vite 8 Single Page App ecosystem)
* **Type Safety:** TypeScript (Enforced compilation via `verbatimModuleSyntax`)
* **Styles & Compilation:** Tailwind CSS v4 + PostCSS pipeline processor
* **Icons:** ApenIcons Collection

---

## 🚀 Quick Start & Installation

### 1. Install Dependencies
Install all required project dependencies while cleanly handling strict Vite 8 peer dependency trees:
```bash
npm install --legacy-peer-deps
```
### 2. Launch Local Development Server
Boot up the local Vite runtime compiler with an explicit cache reset:
```bash
npm run dev -- --force
```
Open your browser canvas to the output port: http://localhost:5173/.

## 📁 Critical Configuration Blueprints

*package.json (Required Dependencies)*
Ensure your environment contains these specific baseline versions:
```bash
{
  "dependencies": {
    "lucide-react": "^0.475.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^6.0.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0",
    "vite": "^8.1.0"
  }
}
```

*postcss.config.js (Root Directory)*
Handles the modern Tailwind v4 compilation layer via module mapping:
```bash
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

*src/index.css (Styles Entrypoint)*
Keeps global style sheets lightweight, offloading core presentation layout layers entirely to utility classes:
```bash
@import "tailwindcss";

@theme {
  --breakpoint-print: print;
}

@media print {
  body {
    background-color: white !important;
  }
}
```

## 📄 Application State Schema (src/types.ts)
The underlying configuration engine treats the resume document as a deeply nested, extensible object context:
```bash
export interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    links: { platform: string; url: string }[];
  };
  summary: string;
  sections: DynamicSection[];
}

export interface DynamicSection {
  id: string;
  title: string;
  type: 'list' | 'text' | 'grid';
  items: SectionItem[];
}

export interface SectionItem {
  id: string;
  title?: string;       
  subtitle?: string;    
  dateRange?: string;   
  description?: string; 
  tags?: string[];      
}
```

## 🖨️ Production Export Guide
To compile a finalized copy, click Export Resume to trigger the browser's native print engine (window.print()).
Ensure the following export options are selected inside your target operating system dialog:
*	Destination: Save as PDF / Print to PDF File
*	Paper Size: A4 Specifications
*	Margins: None (Apen Resume applies precise, standard internal whitespace margins onto the blueprint structure)
*	Options: Ensure Background graphics is checked to maintain accent coloring and formatting shades.
