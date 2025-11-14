import { useState, useEffect } from 'react';
import Select from 'react-select';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '44px',
    borderRadius: '22px',
    borderWidth: '2px',
    borderColor: state.isFocused 
      ? '#3b82f6' // blue-500
      : '#d1d5db', // gray-300
    boxShadow: state.isFocused 
      ? '0 0 0 3px rgba(59, 130, 246, 0.1)' 
      : 'none',
    backgroundColor: '#f9fafb', // gray-50
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#3b82f6', // blue-500
    },
  }),
  
  valueContainer: (provided) => ({
    ...provided,
    padding: '12px 16px',
  }),

  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
    color: '#1f2937', // gray-800
  }),

  placeholder: (provided) => ({
    ...provided,
    color: '#6b7280', // gray-500
  }),

  singleValue: (provided) => ({
    ...provided,
    color: '#1f2937', // gray-800
  }),

  menu: (provided) => ({
    ...provided,
    borderRadius: '22px',
    border: '1px solid #d1d5db', // gray-300
    backgroundColor: '#ffffff', // white
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
    zIndex: 9999,
  }),

  menuList: (provided) => ({
    ...provided,
    padding: '8px',
    display: "flex",
    flexDirection: 'column',
    alignItems: "start",
    gap: '2px',
    maxHeight: '300px',
  }),

  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),

  option: (provided, state) => ({
    ...provided,
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '0.9375rem',
    lineHeight: '1.5',
    color: state.isSelected ? '#ffffff' : '#1f2937',
    backgroundColor: state.isSelected 
      ? '#3b82f6'
      : state.isFocused 
        ? '#f3f4f6'
        : 'transparent',
    '&:hover': {
      backgroundColor: '#f3f4f6',
      color: '#1f2937',
    },
    '&:active': {
      backgroundColor: '#f3f4f6',
    },
    cursor: 'pointer',
  }),

  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    marginRight: '6px',
    marginBottom: '4px',
  }),

  multiValueLabel: (provided) => ({
    ...provided,
    color: '#1f2937',
    padding: '2px 8px',
    fontSize: '0.875rem',
  }),

  multiValueRemove: (provided) => ({
    ...provided,
    color: '#6b7280',
    borderRadius: '0 6px 6px 0',
    padding: '0 6px',
    '&:hover': {
      backgroundColor: '#ef4444',
      color: '#ffffff',
    },
  }),

  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: '#d1d5db',
  }),

  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: '#6b7280',
    padding: '0 12px',
    transition: 'transform 0.2s ease',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0)',
    '&:hover': {
      color: '#1f2937',
    },
  }),

  clearIndicator: (provided) => ({
    ...provided,
    color: '#6b7280',
    padding: '0 12px',
    cursor: 'pointer',
    '&:hover': {
      color: '#1f2937',
    },
  }),

  loadingIndicator: (provided) => ({
    ...provided,
    color: '#6b7280',
  }),

  noOptionsMessage: (provided) => ({
    ...provided,
    color: '#6b7280',
    padding: '16px',
    textAlign: 'center',
  }),
};

export default function ClientSelect({
  options,
  value,
  defaultValue,
  onChange,
  isMulti = false,
  isSearchable = true,
  className = '',
  classNamePrefix = 'react-select',
  placeholder = 'Sélectionner...',
  label,
  error,
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={`w-full ${className}`}>
        {label && <label className="block text-sm font-medium mb-1 text-gray-800">{label}</label>}
        <div className="relative">
          <select 
            className="w-full h-10 pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled
          >
            <option value="">{placeholder}</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium mb-1 text-gray-800">{label}</label>}
      <div className="relative">
        <Select
          options={options}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          isMulti={isMulti}
          isSearchable={isSearchable}
          classNamePrefix={classNamePrefix}
          placeholder={placeholder}
          noOptionsMessage={() => "Aucune option disponible"}
          loadingMessage={() => "Chargement..."}
          styles={customStyles}
          menuPosition="fixed"
          menuPlacement="auto"
          menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
          components={{
            IndicatorSeparator: null,
          }}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-red-600">
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 13H7V7h2v6zm0-8H7V3h2v2z"/>
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}