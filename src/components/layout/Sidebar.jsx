import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users,
  Database, Settings, ChevronDown, ChevronRight
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  const handleToggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const isActive = (path) => location.pathname === path;
  
  const isMenuActive = (menuRoutes) =>
    menuRoutes.some(route => location.pathname.startsWith(route));

  const menuRoutes = {
    employee: ["/dashboard/employees", "/dashboard/documents", "/dashboard/employee/residencystatus"],
    master: [
      "/dashboard/visatypes", "/dashboard/departments", "/dashboard/desginations",
      "/dashboard/titles", "/dashboard/countries", "/dashboard/cities",
      "/dashboard/nationalities", "/dashboard/qualifications"
    ]
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-70 bg-[#450693] text-white flex flex-col
          transform transition-transform duration-300 z-40 shadow-xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {/* ----- Dashboard ----- */}
          <Link
            to="/dashboard"
            className={`block px-4 py-3 rounded-xl text-base font-medium flex items-center gap-3 transition-all duration-200
              ${isActive("/dashboard") 
                ? "bg-white text-[#450693] shadow-lg font-semibold" 
                : "hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          {/* ----- Employee Menu ----- */}
          <div>
            <button
              onClick={() => handleToggleMenu("employee")}
              className={`w-full flex justify-between items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200
                ${isMenuActive(menuRoutes.employee) 
                  ? "bg-[#FFC400] text-[#450693] font-semibold" 
                  : "hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <span className="flex items-center gap-3">
                <Users size={20} /> 
                Employee
              </span>
              {openMenu === "employee" ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>

            {openMenu === "employee" && (
              <div className="ml-6 mt-2 space-y-2 border-l-2 border-[#8C00FF] pl-4">
                <Link 
                  to="/dashboard/employees"
                  className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200
                    ${isActive("/dashboard/employees") 
                      ? "bg-white text-[#450693] font-medium shadow" 
                      : "hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  Add Employee
                </Link>
                <Link 
                  to="/dashboard/documents"
                  className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200
                    ${isActive("/dashboard/documents") 
                      ? "bg-white text-[#450693] font-medium shadow" 
                      : "hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  Documents
                </Link>
                <Link 
                  to="/dashboard/employee/residencystatus"
                  className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200
                    ${isActive("/dashboard/employee/residencystatus") 
                      ? "bg-white text-[#450693] font-medium shadow" 
                      : "hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  Residency
                </Link>
              </div>
            )}
          </div>

          {/* ----- Master Data ----- */}
          <div>
            <button
              onClick={() => handleToggleMenu("master")}
              className={`w-full flex justify-between items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200
                ${isMenuActive(menuRoutes.master) 
                  ? "bg-[#FFC400] text-[#450693] font-semibold" 
                  : "hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <span className="flex items-center gap-3">
                <Database size={20} /> 
                Master Data
              </span>
              {openMenu === "master" ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>

            {openMenu === "master" && (
              <div className="ml-6 mt-2 space-y-2 border-l-2 border-[#8C00FF] pl-4">
                {[
                  { path: "/dashboard/visatypes", label: "Visa Types" },
                  { path: "/dashboard/departments", label: "Departments" },
                  { path: "/dashboard/desginations", label: "Designations" },
                  { path: "/dashboard/titles", label: "Titles" },
                  { path: "/dashboard/countries", label: "Countries" },
                  { path: "/dashboard/cities", label: "Cities" },
                  { path: "/dashboard/nationalities", label: "Nationalities" },
                  { path: "/dashboard/qualifications", label: "Qualifications" },
                  { path: "/dashboard/status", label: "Status" },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200
                      ${isActive(item.path)
                        ? "bg-white text-[#450693] font-medium shadow"
                        : "hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ----- Settings ----- */}
          <Link
            to="/settings"
            className={`block px-4 py-3 rounded-xl text-base font-medium flex items-center gap-3 transition-all duration-200
              ${isActive("/settings") 
                ? "bg-white text-[#450693] shadow-lg font-semibold" 
                : "hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <Settings size={20} /> 
            Settings
          </Link>
        </div>

        <div className="p-4 text-center text-xs opacity-70 border-t border-white/20">
          v1.0.0 • EPR System
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        ></div>
      )}
    </>
  );
}
