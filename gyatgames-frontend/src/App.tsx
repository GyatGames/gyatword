import './App.css'
import { Navbar } from './components/Navbar'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { About } from './pages/About';
import { Hero } from './pages/Hero';
import { Gyatword } from './pages/Gyatword';
import { Leaderboard } from './pages/Leaderboard';
import { CrosswordDataProvider } from './context/CrosswordDataContext';
import "./App.css";
import { AuthProvider } from './context/AuthContext';
import AuthRoute from './components/AuthRoute';
import AuthCallback from './components/AuthCallback';
import { StreaksProvider } from './context/StreaksContext';
function App() {

  return (
    <>
      <AuthProvider>
        <StreaksProvider>
          <BrowserRouter>
            <CrosswordDataProvider>
              <Navbar />
              <Routes>
                {/* Define routes for each page */}
                <Route path="/" element={<Hero />} />
                <Route path="/about" element={<About />} />
                <Route path="/gyatword" element={<Gyatword />} />
                <Route path="/auth" element={<AuthRoute />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                <Route path="/leaderboard" element={<Leaderboard />} />


              </Routes>
            </CrosswordDataProvider>
          </BrowserRouter>
        </StreaksProvider>
      </AuthProvider>
    </>
  )
}

export default App
