import "./styles.css";

const Select = ({ options, className, ...delegated }) => {
  return (
    <select {...delegated} className={`${className} select`}>
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
