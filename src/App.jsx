import React, { useState } from 'react';
import Map from './Map';
import Login from './login_page/Login';

//map component rendered conditionally, eventually may want to render in background. 


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [userId, setUserId] = useState(null);

  const handleLoginSuccess = (userId) => {
    // Logic for successful login
    setUserId(userId);
    setIsLoggedIn(true);

  };

 

  return (
    <>
      {!isLoggedIn && <Login handleLoginSuccess={handleLoginSuccess} />}
      {isLoggedIn && <Map markers={markers} userId={userId} />}
    </>
  );
}

export default App;
