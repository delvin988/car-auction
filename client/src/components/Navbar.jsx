import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  function doLogout() {
    localStorage.clear();
    navigate("login");
  }

  return (
    <section>
      <nav className="px-4 sm:px-10 py-1 bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="w-auto">
            <div className="flex flex-wrap items-center">
              <div className="w-auto mr-14">
                <Link to="/">
                  <img src="/logo.png" alt="" className="w-8 h-8"/>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-auto hidden lg:flex items-center">
            <Link
              to="/mybid"
              className="inline-block mr-12 font-heading font-medium text-base text-white hover:text-gray-200"
            >
              My Bid
            </Link>
            <button
              onClick={doLogout}
              className="inline-block py-4 px-8 font-heading font-medium text-base text-white bg-green-500 hover:bg-green-600 border border-green-500 hover:border-green-600 rounded-sm transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </section>
  );
}
