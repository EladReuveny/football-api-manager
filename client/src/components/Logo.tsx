import logo from "../assets/logo.png";

type LogoProps = {
  width?: string | number;
  height?: string | number;
};

const Logo = ({ width = 75, height = 75 }: LogoProps) => {
  return (
    <img
      src={logo}
      alt="Football API Manager Logo"
      width={width}
      height={height}
      title="Football API Manager"
    />
  );
};

export default Logo;
