import { Outlet } from "react-router-dom";
import authImage from "../assets/images/image 1.png";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left image */}
      <div className="hidden lg:block lg:w-1/2">
        <img src={authImage} alt="" className="w-full h-screen object-cover" />
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center px-6 sm:px-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
