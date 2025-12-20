import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./screens/Home/Home";
import MyNav from "./components/MyNav/MyNav";
import Bio from "./components/Bio/Bio";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <BrowserRouter>
      <MyNav />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/bio" element={<Bio />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
