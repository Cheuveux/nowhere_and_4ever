import { Routes, Route } from 'react-router-dom'
import './App.css'
import Article from './components/articles'
import ArticlePage from './components/ArticlePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Article/>} />
      <Route path="/article/:id" element={<ArticlePage/>} />
    </Routes>
  );
}

export default App;
