type SizedBoxProps = {
  vertical?: number;
  horizontal?: number;
};

const SizedBox = ({ vertical = 0, horizontal = 0 }: SizedBoxProps) => {
  return (
    <div
      style={{
        marginTop: vertical ,
        marginBottom: vertical,
        marginLeft: horizontal,
        marginRight: horizontal,
      }}
    />
  );
};

export default SizedBox;
