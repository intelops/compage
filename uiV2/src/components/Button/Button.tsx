import "./Button.styles.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}
const Button = ({ label, ...props }: ButtonProps) => {
  return (
    <button
      className="bg-primary-color border border-border-color rounded-lg px-5 py-2.5 text-white cursor-pointer transition-opacity duration-300 hover:opacity-80"
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;
