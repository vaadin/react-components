import React from 'react';

export function DetailContent() {
  const formStyle = {
    display: 'flex',
    flexWrap: 'wrap' as any,
    padding: '0.5rem',
    gap: '0.5rem',
  };

  const inputStyle = {
    width: '8rem',
  };

  // Create an array of 12 fields to match the original
  const fields = Array(12).fill(null);

  return (
    <div>
      <div style={formStyle}>
        {fields.map((_, index) => (
          <div className="field" key={index}>
            <input type="text" style={inputStyle} />
          </div>
        ))}
      </div>
    </div>
  );
}
