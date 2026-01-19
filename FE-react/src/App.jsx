import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./service/UserContext";

import SignUp from "./pages/sign-up/sign-up";
import SignInForm from "./pages/login/login";

import Admin from "./pages/admin-panel/Admin";
import Allusers from "./pages/admin-panel/allusers";
import CreateResearch from "./pages/admin-panel/CreateResearch";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Tables */}
          <Route path="/owners" element={<Admin />} />
          <Route path="/users" element={<Allusers />} />

          {/* Create Project + Publication */}
          <Route path="/create-research" element={<CreateResearch />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
