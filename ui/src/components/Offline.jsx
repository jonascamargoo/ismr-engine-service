import React from 'react';

const textStyle = {
  fontFamily: 'Wix Madefor Display',
  letterSpacing: -0.5,
  color: 'red'
}

function Offline() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px',

    }}>
      <p style={textStyle}>Você foi desconectado</p>
    </div>
  );
}

export default Offline;