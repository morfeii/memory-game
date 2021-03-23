import React from 'react';
import '../styles/reset.css';

function App({ Component, pageProps }) {
  return (
    <>
      <div id="root">
        <Component {...pageProps} />
      </div>
      <style jsx global>{`
        body {
          overflow: hidden;
        }

        #root {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: -50px;
        }
      `}</style>
    </>
  );
}

export default App;
