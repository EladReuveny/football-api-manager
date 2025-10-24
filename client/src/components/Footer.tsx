type FooterProps = {};

const Footer = ({}: FooterProps) => {
  return (
    <footer className="bg-(--color-text)/10 text-gray-400 py-6 text-center">
      <p>© {new Date().getFullYear()} Football API Manager. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
