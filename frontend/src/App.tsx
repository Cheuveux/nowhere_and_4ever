
import {Routes, Route } from 'react-router-dom'
import './App.css'
import Article from './components/articles'
import ArticlePage from './components/articlePage'
import Background from './components/img_url_generator/background'


function App() {
  return (
    <>
      <Background />
      <Routes>
        <Route path="/" element={<Article />} />
        <Route path="/article/:id" element={<ArticlePage />} />
      </Routes>
    </>
  );
}

export default App;
