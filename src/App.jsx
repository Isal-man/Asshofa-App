import Routes from "./routes/Routes";
import AuthService from "./services/AuthService";
function App() {
  return (
    <AuthService>
      <Routes />
    </AuthService>
  )
}

export default App