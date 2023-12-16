import { useLocation } from "@solidjs/router";
import { storeTokenFromUrl } from "../utils/utilFunctions";
import { cookieStorage } from "@solid-primitives/storage";

const Home = () => {
  const location = useLocation();

  storeTokenFromUrl(location);
  return (
    <>
      <div>This is home page</div>
    </>
  );
};


export default Home;
