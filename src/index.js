import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Report from './Report/Report'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Report data={{ "name": "Ofri TavorOfri TavorOfri TavorOfri TavorOfri ",
       "date": "2024-08-08T00:00:00.000+00:00",
       "startHour": "2024-08-08T08:00:00.000+00:00",
       "endHour": "2024-08-08T16:00:00.000+00:00",
      "comments": "test" }
      } /> */}

      <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
