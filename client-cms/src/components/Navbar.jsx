import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  function logOut() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <section>
      <nav className="bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="relative flex h-24 items-center">
            <a className="inline-block" href="#">
              <img
                className="h-10"
                src="aurora-assets/logos/aurora-logo-white.svg"
                alt=""
              />
            </a>
            <div className="hidden lg:block ml-auto">
              <button onClick={logOut}>
                <a className="inline-flex items-center justify-center h-10 px-4 text-center leading-loose text-sm text-white font-bold border border-yellowGreen-700 hover:border-white bg-yellowGreen-600 hover:bg-white rounded-lg transition duration-200">
                  Logout
                </a>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </section>
  );
}

export default Navbar;
