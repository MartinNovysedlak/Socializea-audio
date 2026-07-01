"use client";

import React from 'react';
import RentalAutocomplete from './RentalAutocomplete';

interface DynamicBubbleInputProps {
  label: string;
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
}

const DynamicBubbleInput = ({ label, placeholder, items, onChange }: DynamicBubbleInputProps) => {
  return (
    <RentalAutocomplete
      label={label}
      placeholder={placeholder}
      items={items}
      onChange={onChange}
    />
  );
};

export default DynamicBubbleInput;