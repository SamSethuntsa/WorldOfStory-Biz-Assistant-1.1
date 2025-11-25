
# Biz Assistant (MVP) 🚀

**A smart, free business management dashboard designed for South African freelancers and sole proprietors.**

Biz Assistant streamlines the chaos of freelance administration. From managing clients and projects to tracking finances and estimating taxes, this application serves as an all-in-one hub. It leverages **Google Gemini AI** to automate tedious tasks like expense categorization, quote generation, and client communication.

This project is **Donationware**. It is free to use, and users can support the developer via "Buy Me a Coffee".

## ✨ Key Features

### 🤖 AI-Powered Automation
*   **Smart Quote Generator**: Transform a rough client email or text brief into a professional, structured quote and scope of work document in seconds.
*   **Intelligent Expense Categorization**: Simply type a description (e.g., "Adobe Cloud"), and the AI automatically assigns it to the correct accounting category (e.g., "Software & Subscriptions").
*   **Business Coach**: A chat interface that uses your real-time financial data to give specific, actionable advice.
*   **Comms Hub**: Draft professional emails, WhatsApps, or SMS messages tailored to the South African context.

### 🇿🇦 South African Context (Tax & Finance)
*   **Tax Estimator (2025 Tables)**: Real-time estimation of income tax liability based on the latest SARS tax brackets for individuals.
*   **Provisional Tax Breakdown**: Automatically calculates the split for August and February provisional payments.
*   **VAT Monitor**: Visual progress bar tracking turnover against the R1 million VAT registration threshold.

### 💼 Business Management
*   **Dashboard**: High-level view of Net Profit, Revenue vs. Expenses, and monthly financial trends.
*   **Client CRM**: Manage client details with search and filtering.
*   **Project Tracking**: Track project status (Ongoing, Completed, Paused) and rates.
*   **Offline First**: Built as a PWA (Progressive Web App). All data is stored securely on your device. Zero server costs.

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **AI**: Google Gemini API (`gemini-2.5-flash` & `gemini-2.5-pro`)
*   **Icons**: Custom SVG Icons (Lucide-style)

## 🚀 Getting Started

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/biz-assistant.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set your API key:
    *   Create a `.env` file in the root directory.
    *   Add: `API_KEY=your_google_gemini_api_key`
4.  Run the development server:
    ```bash
    npm run dev
    ```

## 📱 Progressive Web App (PWA)

This application is PWA-ready. You can install it on your mobile device for a native-app-like experience.

---

*Built with ❤️ for South African Entrepreneurs.*
