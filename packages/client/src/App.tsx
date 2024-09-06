import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    fetch("http://localhost:8000/api/user/auth/signup", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  return <>Submitly</>;
}

export default App;
