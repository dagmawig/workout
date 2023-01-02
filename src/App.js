import './App.css';
import Header from './components/Header';
import Search from './components/Search';
import Footer from './components/Footer';
import Workout from './components/Workout'; 

function App() {
  return (
    <div className="App">
      <Header/>
      <Workout/>
      <Footer/>
    </div>
  );
}

export default App;
