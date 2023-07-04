import "./styles.css";

const CardWrapper = ({ children, className }) => {
  return <div className={`card-wrapper ${className} `}>{children}</div>;
};

export default CardWrapper;
