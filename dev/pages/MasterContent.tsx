import React from 'react';

export function MasterContent() {
  const masterContentStyle = {
    height: '100%',
    overflow: 'auto',
  };

  const listStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    padding: '0.5rem',
    gridGap: '0.25rem',
  };

  const itemStyle = {
    padding: '1rem',
    border: 'solid 1px #e2e2e2',
  };

  const headingStyle = {
    margin: '0 0 0.25rem',
  };

  return (
    <div style={masterContentStyle}>
      <div style={listStyle}>
        <div style={itemStyle}>
          <h3 style={headingStyle}>Lorem</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
        </div>
        <div style={itemStyle}>
          <h3 style={headingStyle}>Lorem</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
        </div>
        <div style={itemStyle}>
          <h3 style={headingStyle}>Lorem</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
        </div>
        <div style={itemStyle}>
          <h3 style={headingStyle}>Lorem</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
        </div>
        <div style={itemStyle}>
          <h3 style={headingStyle}>Lorem</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
        </div>
        <div style={itemStyle}>
          <h3 style={headingStyle}>Lorem</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
        </div>
      </div>
    </div>
  );
}
