import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import {Route, Routes} from 'react-router-dom'
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import AllFields from "./pages/AllFields";
import EditProfile from "./pages/EditProfile";
import Questionnaire from "./pages/Questionnaire";
import SuccessSavedResponse from "./pages/SuccessSavedResponse";
import AllResponses from "./pages/AllResponses";
import ChangePassword from "./pages/ChangePassword";
import RequireAuth from "./components/RequireAuth";

function App() {
    return (
        <Routes>
            <Route path={"/login"} element={<Login/>}/>
            <Route path={"/signup"} element={<Registration/>}/>
            <Route path={"/fields"} element={<RequireAuth><AllFields/></RequireAuth>}/>
            <Route path={"/profile/edit"} element={<RequireAuth><EditProfile/></RequireAuth>}/>
            <Route path={"/profile/change-password"} element={<RequireAuth><ChangePassword/></RequireAuth>}/>
            <Route path={"/questionnaires/:id"} element={<Questionnaire/>}/>
            <Route path={"/questionnaires/success"} element={<SuccessSavedResponse/>}/>
            <Route path={"/responses"} element={<RequireAuth><AllResponses/></RequireAuth>}/>
            <Route path={"/"} element={<RequireAuth><AllFields/></RequireAuth>}/>
        </Routes>
    );
}

export default App;
