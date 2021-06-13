import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Bookshelf} from "./components/Bookshelf";
import './styles/styles.css'

function App() {
  return (
      <div>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
        <div className="firstForm">
            <Bookshelf />
        </div>
      </div>
  );
}

export default App;
