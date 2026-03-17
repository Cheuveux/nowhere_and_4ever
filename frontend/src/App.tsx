
import {Routes, Route } from 'react-router-dom'
import './App.css'
import Article from './components/articles'
import ArticlePage from './components/articlePage'
import ConversationPage from './components/conversationPage/conversation'
import DelusionalQuiz from './quiz/DelusionalQuiz'

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
