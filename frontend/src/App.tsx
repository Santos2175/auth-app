import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AppLayout from './components/layouts/AppLayout';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes></Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
