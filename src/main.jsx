import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

function Page() {
  return (
    <App />
  );
}

createRoot(document.getElementById("root")).render(<Page />);
