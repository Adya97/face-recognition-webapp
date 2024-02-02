import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Admin from './Pages/Admin';
import { useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
const uuid = require('uuid');

function App() {
  const [image, setImage] = useState(null);
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to authenticate.');
  const [visitorName, setVisitorName] = useState('placeholder.jpg');
  const [isAuth, setAuth] = useState(false);

  function sendImage(e){
    e.preventDefault();
    if(image) {
      setVisitorName(image.name);
      const visitorImageName = uuid.v4();
      fetch(`https://tu1mnbkcg5.execute-api.eu-west-1.amazonaws.com/dev/attendface-visit-img/${visitorImageName}.jpg`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpg'
        },
        body: image 
      }).then(async () => {
        const response = await authenticate(visitorImageName);
        if(response.Message === 'Success'){
          setAuth(true);
          setUploadResultMessage(`Hi ${response['firstname']} ${response['lastname']}, Welcome to work. Have a great day`) 
        } else {
          setAuth(false);
          setUploadResultMessage('Authentication failed: Not an Employee')
        }
      }).catch(error => {
        setAuth(false)
        setUploadResultMessage('There is an error during the authentication process, please try again')
        console.error(error);
      })
    }
  }

  async function authenticate(visitorImageName){
    const requestUrl = `https://tu1mnbkcg5.execute-api.eu-west-1.amazonaws.com/dev/emp?${new URLSearchParams({
      objectKey: `${visitorImageName}.jpeg`
    })}`;
    return await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then((data) => {
      return data;
    }).catch(error => console.error(error));
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        user ? 
        <div className="App">
          <Router>
            <div>
            <NavLink activeClassName="active" to="/Admin">Admin Access</NavLink>
            </div>
            <Routes>
              <Route path="/admin" element={<Admin />}/>
            </Routes>
          </Router>
          <h2>Attend Face Recognition System</h2>
          <form onSubmit={sendImage}>
            <input type='file' name='image' onChange={e => setImage(e.target.files[0])}/>
            <button type='submit'>Authenticate</button>
          </form>
          <div className={isAuth ? 'Success' : 'Failure'}>{uploadResultMessage}</div>
          <img src={require(`./Visitors/${visitorName}`)} alt='Visitor' height={250} width={250}/>
          <button onClick={signOut}>Sign Out</button>
        </div> : <Admin />
      )}
    </Authenticator>
  );
}

export default App;
