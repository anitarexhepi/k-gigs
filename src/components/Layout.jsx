import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="pt-12 px-4 min-h-screen">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;


