import React, { useState, useEffect } from "react";
import { useAuth } from "../../Contexts/useAuth";
import { GetCurrentUser, UserDto } from "../../Services/ProfileService";
import ProfileModal from "../ProfileModal/ProfileModal";

type Props = {};

const NavBar = (props: Props) => {
  const { isLoggedIn, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      fetchCurrentUser();
    }
  }, [isLoggedIn]);

  const fetchCurrentUser = async () => {
    try {
      const user = await GetCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const handleProfileClick = () => {
    setProfileModalOpen(true);
  };

  const handleProfileClose = () => {
    setProfileModalOpen(false);
    fetchCurrentUser(); // Refresh user data after profile update
  };
  return (
    <div className="bg-[#171717]">
      <nav className=" border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#08D6DA] to-[#9DF8FA] bg-clip-text text-transparent font-sans">
            InvenTrack
          </h1>

          {/* <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Flowbite
            </span>
          </a> */}
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            {isLoggedIn() && currentUser ? (
              <button
                onClick={handleProfileClick}
                className="text-sm text-gray-500 dark:text-white hover:underline"
              >
                {currentUser.phone || "My Profile"}
              </button>
            ) : (
              <a
                href="tel:+91-6369269540"
                className="text-sm  text-gray-500 dark:text-white hover:underline"
              >
                (+91) 6369269540
              </a>
            )}
            {!isLoggedIn() ? (
              <>
                <a
                  href="login"
                  className="text-sm  text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Login
                </a>
                <a
                  href="register"
                  className="text-sm  text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Signup
                </a>
              </>
            ) : (
              <a
                href="/"
                onClick={(e) => {
                  logout();
                }}
                className="text-sm  text-blue-600 dark:text-blue-500 hover:underline"
              >
                Logout
              </a>
            )}
          </div>
        </div>
      </nav>
      <ProfileModal isOpen={isProfileModalOpen} onClose={handleProfileClose} />
    </div>
  );
};

export default NavBar;
