# Core AI Assistant

A modern, themeable AI assistant powered by Google's Gemini models. Built with React 19, Vite, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Gemini Powered**: Uses `gemini-3-flash-preview` for lighting-fast, intelligent responses.
- **Multiple Themes**: Switch between Modern (Blue), Midnight (Dark), Emerald, Violet, and Crimson.
- **Real-time Streaming**: Responses stream in real-time as they are generated.
- **Markdown Support**: Rich text formatting for code blocks, lists, and links.
- **Responsive Design**: Polished experience on both desktop and mobile.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- An API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd core-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
   *(Note: The application is configured to look for `process.env.GEMINI_API_KEY` which Vite injects during build via the `define` config)*

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📦 Deployment

### Build for Production

```bash
npm run build
```
This will generate a `dist` folder containing optimized static assets.

### Hosting

You can host this application on any static site hosting provider:
- **Vercel / Netlify**: Simply connect your GitHub repository; it will auto-detect the Vite project.
- **GitHub Pages**: Ensure you set the `base` in `vite.config.ts` if your site is not at the root domain.

**Important Security Note**: This client-side application exposes your API key to the browser. For production apps with public traffic, it's recommended to proxy Gemini requests through a private backend server.

## 📝 License

This project is licensed under the Apache-2.0 License.

omo × 1000