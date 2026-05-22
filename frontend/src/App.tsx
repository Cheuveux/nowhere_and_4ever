import {Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import './App.css'
import Article from './components/homePage/articles'
import ArticlePage from './components/article/articlePage'
import TakePage from './components/takes/takesPage'
import ConversationPage from './components/conversation/conversation'
import DelusionalQuiz from './components/quiz/DelusionalQuiz'
import MosaicGrid from './components/grid_content/MosaicGrid'
import AnimIntro from './components/anim_intro/animIntro'
function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers /intro si c'est la première visite ET qu'on n'est pas déjà sur /intro
    if (!sessionStorage.getItem('introWatched') && location.pathname === '/') {
      navigate('/intro');
      sessionStorage.setItem('introWatched', 'true');
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <Routes>
        <Route path="/intro" element={<AnimIntro />} />
        <Route path="/" element={<Article />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/takes/:id" element={<TakePage />} />
        <Route path="/conversation/:id" element={<ConversationPage/>} />
        <Route path="/quiz" element={<DelusionalQuiz />} />
        <Route path="/mosaics" element={<MosaicGrid />} />
      </Routes>
    </>
  );
}

export default App;
