import React, { useEffect, useRef, useState } from "react";
import {
  Scrypt,
  ScryptProvider,
  SensiletSigner,
  ContractCalledEvent,
  ByteString,
  hash256,
  hash160,
  PubKey,
  toHex
} from "scrypt-ts";
import './App.css';
//import { Voting } from "./contracts/voting";


interface User {
  username: string;
  password: string;

}

const users: User[] = [
  { username: 'John Doe', password: '123456' },
  // Add more predefined users here if needed
];

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

const PaymentPage: React.FC<{ username: string; onLogout: () => void }> = ({
  username,
  onLogout,
}) => {
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);

  const handleConfirmTransaction = () => {
    // Here, you can perform additional actions related to the transaction confirmation if needed.
    setTransactionConfirmed(true);
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <p>Payment for {username}</p>
      {transactionConfirmed ? (
        <p>Transaction Confirmed! Thank you for your purchase.</p>
      ) : (
        <button onClick={handleConfirmTransaction}>Deposit</button>
      )}
      <button>Destroy</button>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};



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
        <PaymentPage username={user.username} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
