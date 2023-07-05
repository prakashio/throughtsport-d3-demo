const Select = ({ options, className, ...delegated }) => {
  return (
    <select {...delegated} className={`${className} border rounded w-60 h-8`}>
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
