import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import CaptainContext from "./context/CaptainContext.jsx";
import SocketProvider from "./context/SocketContext.jsx";
import FareContext from "./context/FareContext.jsx";

createRoot(document.getElementById("root")).render(

    <CaptainContext>
      <UserContext>
        <SocketProvider>
          <FareContext>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </FareContext>
        </SocketProvider>
      </UserContext>
    </CaptainContext>

);
