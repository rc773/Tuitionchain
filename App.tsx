import React, { useEffect, useRef, useState } from "react";
import logo from './logo.svg';
import './App.css';
import {
  Scrypt,
  ScryptProvider,
  SensiletSigner,
  ContractCalledEvent,
  ByteString,
  findSig,
  SignatureResponse
} from "scrypt-ts";
import { scholarship } from "./contracts/voting";

interface User {
  username: string;
  password: string;
  name: string;
}

const users: User[] = [
  { username: 'Rachel_Williams', password: '123456', name: 'User One' },
  { username: 'user2', password: 'password2', name: 'User Two' }
];

interface GpaResponse {
  GPA: number;
  digest: ByteString
  Signatures:{
    Rabin:{
        PubKey: bigint,
        Sig_S:ByteString,
        Sig_U:ByteString
      }
    }

}

const LoginPage: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
      onLogin(user);
    } else {
      alert('Invalid username or password. Please try again.');
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};
/*
const GpaPage: React.FC<{ username: string; onLogout: () => void }> = ({
  username,
  onLogout,
}) => {
  const [GPA, setGpa] = useState<number | null>(null);

  useEffect(() => {
    // Replace 'API_ENDPOINT' with the actual API endpoint that provides GPA data based on the username.
    const url = `http://16.171.36.57:5000/api/gpa?name=${username}`;
    //const url = `http://localhost:5000/api/gpa?name=${username}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then((data: GpaResponse) => setGpa(data.GPA))
      .catch((error) => {
        console.error('Error fetching GPA:', error);
        setGpa(null); // Set GPA to null if there's an error or the response is not ok.
      });
  }, [username]);

  return (
    <div>
      <h1>GPA Page</h1>
      {GPA !== null ? (
        <div>
          <p>Your GPA: {GPA}</p>
          {GPA >= 3.5 ? (
            <p>Congratulations! You've earned a scholarship!</p>
          ) : (
            <p>We're sorry, you didn't qualify for a scholarship.</p>
          )}
        </div>
      ) : (
        <p>Loading GPA...</p>
      )}
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};
*/
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <GpaPage username={user.username} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;


const GpaPage: React.FC<{ username: string; onLogout: () => void }> = ({
  username,
  onLogout,
}) => {
  const [GPA, setGpa] = useState<number | null>(null);

  useEffect(() => {
    // Replace 'API_ENDPOINT' with the actual API endpoint that provides GPA data based on the username.
    const url = `http://16.171.36.57:5000/api/gpa?name=${username}`;
    //const url = `http://localhost:5000/api/gpa?name=${username}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then((data: GpaResponse) => setGpa(data.GPA))
      .catch((error) => {
        console.error('Error fetching GPA:', error);
        setGpa(null); // Set GPA to null if there's an error or the response is not ok.
      });
  }, [username]);
  const scholarship = async () =>{
    const [scholarshipContract, setContract] = useState<scholarship>();
    const signerRef = useRef<SensiletSigner>();
    const [error, setError] = React.useState("");
    const [msg, setMsg] = useState<ByteString | null>('null')
    const [SigS, setSigS] = useState<ByteString | null>('null')
    const [SigU, setSigU] = useState<ByteString | null>('null')
    const signer = signerRef.current as SensiletSigner;
    if (scholarshipContract && signer) {
      const {isAuthenticated,error} = await signer.requestAuth();
      if(!isAuthenticated) {
        throw new Error(error);
      }
      await scholarshipContract.connect(signer);
      useEffect(() => {
        // Replace 'API_ENDPOINT' with the actual API endpoint that provides GPA data based on the username.
        const url = `http://16.171.36.57:5000/api/gpa?name=${username}`;
        //const url = `http://localhost:5000/api/gpa?name=${username}`;
    
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok.');
            }
            return response.json();
          })
          .then((data: GpaResponse) => setMsg(data.digest))
          .catch((error) => {
            console.error('Error fetching GPA:', error);
            
          });
      }, [username]);
      useEffect(() => {
        // Replace 'API_ENDPOINT' with the actual API endpoint that provides GPA data based on the username.
        const url = `http://16.171.36.57:5000/api/gpa?name=${username}`;
        //const url = `http://localhost:5000/api/gpa?name=${username}`;
    
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok.');
            }
            return response.json();
          })
          .then((data: GpaResponse) => setSigS(data.Signatures.Rabin.Sig_S))
          .catch((error) => {
            console.error('Error fetching Sig:', error);
            
          });
      }, [username]);
      useEffect(() => {
        // Replace 'API_ENDPOINT' with the actual API endpoint that provides GPA data based on the username.
        const url = `http://16.171.36.57:5000/api/gpa?name=${username}`;
        //const url = `http://localhost:5000/api/gpa?name=${username}`;
    
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok.');
            }
            return response.json();
          })
          .then((data: GpaResponse) => setSigU(data.Signatures.Rabin.Sig_U))
          .catch((error) => {
            console.error('Error fetching Sig:', error);
            
          });
      }, [username]);
      const studentPK = signer.getDefaultPubkey()
      scholarshipContract.methods.parseGPA(msg)
      const RabinSig = SigS + SigU
      const { tx: callTx } = await scholarshipContract.methods.unlock(
        msg, RabinSig,
        // the first argument `sig` is replaced by a callback function which will return the needed signature
        (sigResps:SignatureResponse[]) => findSig(sigResps, studentPK))
    } 
  }

  return (
    <div>
      <h1>GPA Page</h1>
      {GPA !== null ? (
        <div>
          <p>Your GPA: {GPA}</p>
          {GPA >= 3.5 ? (
            <p>Congratulations! You've earned a scholarship!</p>
          ) : (
            <p>We're sorry, you didn't qualify for a scholarship.</p>
          )}
        </div>
      ) : (
        <p>Loading GPA...</p>
      )}
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};