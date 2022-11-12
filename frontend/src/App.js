import { Route } from 'react-router-dom';
import './App.css';
import Footer from './components/auth/Footer';
import ChatPage from './Pages/ChatPage';
import HomePage from './Pages/HomePage';

function App() {
  return (
    <>
    <div className="App">
      <Route path="/" component={HomePage} exact />
      <Route path="/chats" component={ChatPage} />
    </div>
    <Footer />
    </>
  );
}

export default App;
