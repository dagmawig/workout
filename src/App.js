import './App.css';
import Header from './components/Header';
import Search from './components/Search';
import Footer from './components/Footer';
import Workout from './components/Workout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewTemplate from './components/NewTemplate';
import ShowTemp from './components/ShowTemp';
import EditTemplate from './components/EditTemplate';
import LogWorkout from './components/LogWorkout';
import History from './components/History';
import Loading from './components/Loading';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Reset from './components/PassReset';

function App() {
  return (
    <Router >
      <div className="App">
        <Routes>
          <Route path="/" element={
          <>
          <Header/>
          <Loading />
          <Search/>
          <Footer/>
          </>
          }/>
          <Route path="/workout" element={
          <>
          <Header/>
          <Loading />
          <Workout/>
          <Footer/>
          </>
        }/>
        <Route path="/template" element={
          <>
          <Header/>
          <Loading/>
          <NewTemplate/>
          <Footer/>
          </>
        }/>
        <Route path="/showtemp" element={
          <>
          <Header/>
          <Loading />
          <ShowTemp/>
          <Footer/>
          </>
        }/>
        <Route path="/edittemp" element={
          <>
          <Header/>
          <Loading />
          <EditTemplate/>
          <Footer/>
          </>
        }/>
        <Route path="/logworkout" element={
          <>
          <Header/>
          <Loading />
          <LogWorkout/>
          <Footer/>
          </>
        }/>
        <Route path="/history" element={
          <>
          <Header/>
          <Loading />
          <History/>
          <Footer/>
          </>
        }/>
        <Route path="/login" element={
          <>
          <Loading />
          <Login/>
          </>
        }/>
        <Route path="/signup" element={
          <>
          <Loading />
          <SignUp/>
          </>
        }/>
        <Route path="/reset" element={
          <>
          <Loading />
          <Reset/>
          </>
        }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
