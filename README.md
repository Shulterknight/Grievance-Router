# 🚀 Grievance Router: AI-Powered Consumer Complaint Assistant

**Grievance Router** is an intelligent web application designed to help users effectively route their consumer complaints. By leveraging the power of **Google's Gemini AI**, it analyzes user grievances, determines their urgency, suggests appropriate government portals, and even drafts a formal complaint letter automatically.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Key Features

- **🤖 AI-Powered Analysis**: Uses Google Gemini (2.5-Flash) to deeply understand the nature of your complaint.
- **🚨 Smart Urgency Detection**: Automatically classifies issues as **High**, **Medium**, or **Low** urgency to help you prioritize.
- **🌐 Intelligent Routing**: Suggests **at least 3 relevant government portals** (e.g., PGPortal, NCH, State Forums) tailored to your specific issue.
- **📝 Automated Drafting**: Generates a professional, legally-sound **complaint draft** that you can copy and submit immediately.
- **📄 Document Checklist**: Provides a list of necessary documents you'll need for your complaint.
- **🎨 Modern UI**: Features a beautiful split-screen interface with **Glassmorphism**, responsive design, and smooth animations using **React** & **Tailwind CSS**.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js
- **AI Engine**: Google Gemini API (`gemini-2.5-flash`)
- **Styling**: Modern Glassmorphism & Gradient Aesthetics

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js installed
- A Google Gemini API Key

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder and add your API key:
```env
GEMINI_API_KEY=your_api_key_here
```

Start the server:
```bash
npm start
```
*The server will run on `http://localhost:5000`*

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```
*The app will be available at `http://localhost:5173`*

## 📖 How to Use

1.  Open the app in your browser.
2.  In the **"Describe Problem"** box, type your grievance in detail (e.g., "I ordered a phone but received a soap bar...").
3.  Click the **"Analyze Grievance"** button.
4.  View the results on the right panel:
    - Check the **Urgency Level**.
    - Click on the **Suggested Portals** to file your complaint.
    - Copy the **Complaint Draft** and use it for your submission.

## 🔒 Security
- API keys are secured using `.env` files.
- The repository is configured to ignore sensitive files via `.gitignore`.

---
*Built with ❤️ for better consumer rights.*