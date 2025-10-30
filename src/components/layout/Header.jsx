import { LogOut, Bell, Search, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const Header = ({ handleLogout, userName = "Admin User", userRole = "Administrator", onMenuToggle }) => {

  return (
    <header className="bg-[#450693] text-white px-6 py-4 shadow-lg border-b border-[#8C00FF]">
      <div className="flex justify-between items-center">
        {/* Left Section - Hamburger & Page Title */}
        <div className="flex items-center space-x-4">
          {/* Mobile Hamburger Menu */}
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-[#8C00FF] hover:bg-opacity-30 transition-colors"
          >
            <Menu size={24} className="text-white" />
          </button>

          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
              <img src="/logo2.svg" alt="Logo" className='h-8 w-8' />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Dashboard</h1>
              <p className="text-sm text-gray-400 hidden sm:block">
                Overview of your system
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - User Controls */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-[#8C00FF] hover:bg-opacity-30 transition-colors group">
            <Bell size={20} className="text-purple-200" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF3F7F] rounded-full border-2 border-[#450693]"></div>
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="text-[#450693] font-semibold mb-2">Notifications</div>
              <div className="text-sm text-gray-600">No new notifications</div>
            </div>
          </button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl border-2 border-gray-200 group-hover:border-[#FFC400] transition-colors duration-200 overflow-hidden">
                    <img
                      src={"/user-avatar.jpg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-white">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {userRole}
                  </p>
                </div>
                <ChevronDown 
                  size={16} 
                  className="text-gray-400 group-hover:text-white transition-colors duration-200" 
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-64 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl p-2"
              align="end"
            >
              <DropdownMenuItem className="p-4 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl border border-gray-200 overflow-hidden">
                    <img
                      src={'/user-avatar.jpg'}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userRole}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-gray-100" />
              
              <DropdownMenuItem
                className="flex items-center space-x-3 p-3 cursor-pointer rounded-lg hover:bg-red-50 transition-colors duration-200 text-red-600"
                onClick={handleLogout}
              >
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <LogOut size={16} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sign out</p>
                  <p className="text-xs text-red-500">Log out of your account</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;