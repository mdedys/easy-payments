import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import MuiButton from "@material-ui/core/Button";

const App = () => {
  const {user, loginWithRedirect, logout} = useAuth0();
  console.log("user: ", user);

  React.useEffect(() => {
    if (!user) return;
    if (!user["https://easy-payments.com/is_new"]) return;
  }, [user]);

  return (
    <div>
      <MuiButton variant="contained" onClick={() => loginWithRedirect()}>
        Sign Up
      </MuiButton>
      <MuiButton variant="contained" onClick={() => logout()}>
        Logout
      </MuiButton>
    </div>
  );
};

export default App;
