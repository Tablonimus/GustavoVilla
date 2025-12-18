import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./screens/Home/Home";
import MyNav from "./components/MyNav/MyNav";

function App() {
 

  return (
    <BrowserRouter>
    
      <MyNav />
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
  
    </BrowserRouter>
  );
}

export default App;
