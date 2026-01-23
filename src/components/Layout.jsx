import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const syncAuth = () => setRefresh(prev => !prev);
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <>
      <Navbar key={refresh} />
      <main className="pt-12 px-4 min-h-screen">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;



