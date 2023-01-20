const Text = (props) => {

  const { type, value, onChange } = props;

  return <input type={type} value={value} onChange={onChange} />;
};

export default Text;
