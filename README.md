# SportsOrca Full Stack Internship Task – Upcoming Matches List

A responsive web application that displays upcoming soccer matches from the English Premier League using data from TheSportsDB API.

## 🚀 Live Demo

- **Frontend**: Built with React + TypeScript + Vite + TailwindCSS
- **Backend**: Optional Node.js + Express server for API relay

## 📋 Features

- ✅ **Responsive Design**: Works seamlessly on mobile and desktop
- ✅ **Real-time Data**: Fetches upcoming matches from TheSportsDB API
- ✅ **Clean UI**: Modern card-based design with team badges
- ✅ **Loading States**: Smooth loading animations
- ✅ **Error Handling**: Graceful error handling with retry functionality
- ✅ **Team Information**: Displays Home vs Away teams with badges
- ✅ **Match Details**: Shows formatted date and time for each match
- ✅ **Optional Backend**: Express.js server for API abstraction

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Axios** for API calls
- **Lucide React** for icons

### Backend (Optional)

- **Node.js** with Express.js
- **CORS** for cross-origin requests
- **Axios** for external API calls
- **dotenv** for environment variables

## 📁 Project Structure

```
sportsorca-task/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript interfaces
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   └── ...
├── server/                 # Optional Node.js backend
│   ├── index.js           # Express server
│   ├── package.json
│   └── .env
├── README.md
└── .env
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sportsorca-task
   ```

2. **Setup Frontend**

   ```bash
   cd client
   npm install
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

3. **Setup Backend (Optional)**
   ```bash
   cd ../server
   npm install
   npm run dev
   ```
   The backend will start on `http://localhost:4000`

### Environment Variables

#### Frontend

No environment variables required - the app directly calls TheSportsDB API.

#### Backend (Optional)

Create a `.env` file in the `server/` directory:

```env
PORT=4000
NODE_ENV=development
API_BASE_URL=https://www.thesportsdb.com/api/v1/json/3
EPL_LEAGUE_ID=4328
FRONTEND_URL=http://localhost:5173
```

## 🌐 API Information

### Primary API Source

- **TheSportsDB API**: `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328`
- **League**: English Premier League (ID: 4328)
- **No API key required** for the free tier

### Backend Endpoints (Optional)

If using the backend server:

- `GET /` - API information
- `GET /api/upcoming-matches` - Get upcoming matches
- `GET /health` - Health check

## 📱 Usage

1. **View Upcoming Matches**: The application automatically loads and displays upcoming Premier League matches
2. **Responsive Design**: Access on any device - the layout adapts automatically
3. **Team Information**: Each match card shows:
   - Home team vs Away team
   - Team badges (when available)
   - Match date and time (formatted)
4. **Loading & Error States**: Smooth loading animations and error handling with retry options

## 🎨 Design Features

- **Modern UI**: Clean, card-based design with subtle shadows and hover effects
- **Team Badges**: Official team logos displayed when available
- **Responsive Grid**: 1 column on mobile, 2 on tablet, 3 on desktop
- **Loading Animation**: Spinning loader with descriptive text
- **Error Handling**: User-friendly error messages with retry functionality
- **Typography**: Clean, readable fonts with proper hierarchy

## 🔧 Development Scripts

### Frontend (client/)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (server/)

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## 🌟 Bonus Features Implemented

- ✅ **Loading States**: Smooth loading animations
- ✅ **Hover Effects**: Card hover animations
- ✅ **Error Handling**: Comprehensive error handling with retry
- ✅ **Responsive Design**: Mobile-first responsive layout
- ✅ **Team Badges**: Official team logos when available
- ✅ **Modern Icons**: Lucide React icons for enhanced UX
- ✅ **Optional Backend**: Express.js server for API abstraction

## 🚀 Potential Enhancements

- [ ] **Filter by Date**: Add date range filtering
- [ ] **Match Countdown**: Show time remaining until match
- [ ] **Dark Mode**: Toggle between light and dark themes
- [ ] **Match Details**: Click to view more match information
- [ ] **Notifications**: Browser notifications for upcoming matches
- [ ] **Multiple Leagues**: Support for other leagues

## 📝 API Response Structure

```typescript
interface Match {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  dateEvent: string; // YYYY-MM-DD format
  strTime: string; // HH:MM:SS format
  idHomeTeam: string;
  idAwayTeam: string;
  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;
  strLeague: string;
}
```

## 🤝 Contributing

This project was built as part of the SportsOrca Full Stack Internship Task.

## 📄 License

ISC License

---

**Built with ❤️ for SportsOrca**
