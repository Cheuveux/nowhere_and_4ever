
import {Routes, Route } from 'react-router-dom'
import './App.css'
import Article from './components/homePage/articles'
import ArticlePage from './components/article/articlePage'
import TakePage from './components/takes/takesPage'
import ConversationPage from './components/conversation/conversation'
import DelusionalQuiz from './components/quiz/DelusionalQuiz'
import MosaicGrid from './components/grid_content/MosaicGrid'

function App() {
  return (
    <>
      <Routes>
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
