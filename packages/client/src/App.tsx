import "./App.css";
import { Box } from "@radix-ui/themes";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Box className="bg-secondary text-textPrimary min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </Box>
  );
}

export default App;
