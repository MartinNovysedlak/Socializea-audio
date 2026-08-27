import React from 'react';

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="text-xs text-red-400 mt-1">{message}</p>;
};

export default FieldError;
