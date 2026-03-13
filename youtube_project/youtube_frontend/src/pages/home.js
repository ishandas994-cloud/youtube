import HomePage from "../component/HomePage/HomePage";
import "./home.css";

const Home = ({ sideNavbar }) => {
  return (
    <div className="home">
      <HomePage sideNavbar={sideNavbar} />
    </div>
  );
};

export default Home;
