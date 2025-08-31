import React, { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

const SelectDropdown = ({ options = [], value, onChange, placeholder = "Select an option" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-sm text-black bg-white border border-slate-100 outline-none p-2.5 py-3 rounded-md mt-2 flex justify-between items-center"
      >
        {selectedOption ? selectedOption.label : placeholder}
        <span className="ml-2 transform transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <LuChevronDown />
        </span>
      </button>

      {isOpen && options.length > 0 && (
        <div className="absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10 max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
