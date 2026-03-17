
import {Routes, Route } from 'react-router-dom'
import './App.css'
import Article from './components/homePage/articles'
import ArticlePage from './components/article/articlePage'
import ConversationPage from './components/conversation/conversation'
import DelusionalQuiz from './components/quiz/DelusionalQuiz'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Article />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/conversation/:id" element={<ConversationPage/>} />
        <Route path="/quiz" element={<DelusionalQuiz />} />
      </Routes>
    </>
  );
}

export default App;
