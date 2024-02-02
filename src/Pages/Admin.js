import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const Admin = () => {
    return(
        <Authenticator>
            {({ signOut }) => {
                return (
                    <div>
                        <h1>Hello, This is Admin Access</h1>
                        <h3>You got the Admin Access!!</h3>
                        <button onClick={signOut}>Sign Out</button>
                    </div>
                );
            }}
        </Authenticator>
    );
}

export default Admin;
