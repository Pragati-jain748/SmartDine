import "./App.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router , Routes , Route } from "react-router-dom";
import Home from "./Pages/Home";
import Success from "./Pages/Success";
import NotFound from "./Pages/NotFound";
import ChatBot from "./components/ChatBot";

const App = () => {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/success" element={<Success/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
    <Toaster/>
    <ChatBot/>
  </Router>
  );
};

export default App;
