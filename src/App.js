import './App.css';
import Header from './components/Header';
import Search from './components/Search';
import Footer from './components/Footer';
import Workout from './components/Workout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router >
      <div className="App">
        <Routes>
          <Route path="/" element={
          <>
          <Header/>
          <Search/>
          <Footer/>
          </>
          }/>
          <Route path="/workout" element={
          <>
          <Header/>
          <Workout/>
          <Footer/>
          </>
        }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
