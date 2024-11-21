import { useAuth } from "../contexts/AuthProvider";
import Login from "./Login";
// import Online from "../components/Online";
import LobbyScreen from "./Lobby";

const Home = () => {
    const { authToken } = useAuth();

    return (
        <div>
            {authToken ? <><LobbyScreen /></> : <Login />}
        </div>
    );
};

export default Home;
