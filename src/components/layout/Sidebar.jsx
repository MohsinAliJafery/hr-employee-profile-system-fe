import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu, X,
  LayoutDashboard, Users, FolderOpen, FileText, UserPlus,
  Database, Briefcase, GraduationCap, Globe, Building, MapPin,
  BarChart3, Calendar, Settings, ChevronDown, ChevronRight
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  const handleToggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#450693] text-white flex justify-between items-center p-4 shadow-lg">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="font-semibold">EPR System</span>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:static top-0 left-0 h-full w-70 bg-[#450693] text-white flex flex-col
        transform transition-transform duration-300 z-40 shadow-xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}>
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">

          {/* ----- Dashboard ----- */}
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-3 rounded-xl text-base font-medium flex items-center gap-3
              ${isActive("/dashboard") ? "bg-white text-[#8C00FF] shadow" : "hover:bg-white/10"}
            `}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          {/* ----- Employee Menu ----- */}
          <div>
            <button
              onClick={() => handleToggleMenu("employee")}
              className="w-full flex justify-between px-4 py-3 rounded-xl hover:bg-white/10"
            >
              <span className="flex items-center gap-3 font-medium">
                <Users size={20} /> Employee
              </span>
              {openMenu === "employee"
                ? <ChevronDown size={18} />
                : <ChevronRight size={18} />
              }
            </button>

            {openMenu === "employee" && (
              <div className="ml-6 mt-2 space-y-2 border-l border-white/30 pl-4">
                <Link to="/dashboard/employees"
                  onClick={() => setIsOpen(false)}
                  className={`block p-2 rounded hover:bg-white/10 ${isActive("/dashboard/employees") && "bg-white text-[#8C00FF]"}`}>
                  Add Employee
                </Link>
                <Link to="/dashboard/documents"
                  onClick={() => setIsOpen(false)}
                  className={`block p-2 rounded hover:bg-white/10 ${isActive("/dashboard/documents") && "bg-white text-[#8C00FF]"}`}>
                  Documents
                </Link>
                <Link to="/dashboard/employee/residencystatus"
                  onClick={() => setIsOpen(false)}
                  className={`block p-2 rounded hover:bg-white/10 ${isActive("/dashboard/employee/residencystatus") && "bg-white text-[#8C00FF]"}`}>
                  Residency
                </Link>
              </div>
            )}
          </div>

          {/* ----- Master Data ----- */}
          <div>
            <button
              onClick={() => handleToggleMenu("master")}
              className="w-full flex justify-between px-4 py-3 rounded-xl hover:bg-white/10"
            >
              <span className="flex items-center gap-3 font-medium">
                <Database size={20} /> Master Data
              </span>
              {openMenu === "master"
                ? <ChevronDown size={18} />
                : <ChevronRight size={18} />
              }
            </button>

            {openMenu === "master" && (
              <div className="ml-6 mt-2 space-y-2 border-l border-white/30 pl-4">
                <Link to="/dashboard/visatypes" className="block py-2 rounded hover:bg-white/10">Visa Types</Link>
                <Link to="/dashboard/departments" className="block py-2 rounded hover:bg-white/10">Departments</Link>
                <Link to="/dashboard/desginations" className="block py-2 rounded hover:bg-white/10">Designations</Link>
                <Link to="/dashboard/titles" className="block py-2 rounded hover:bg-white/10">Titles</Link>
                <Link to="/dashboard/countries" className="block py-2 rounded hover:bg-white/10">Countries</Link>
                <Link to="/dashboard/cities" className="block py-2 rounded hover:bg-white/10">Cities</Link>
              </div>
            )}
          </div>

          {/* ----- Reports ----- */}
          {/* <div>
            <button
              onClick={() => handleToggleMenu("reports")}
              className="w-full flex justify-between px-4 py-3 rounded-xl hover:bg-white/10"
            >
              <span className="flex items-center gap-3 font-medium">
                <BarChart3 size={20} /> Reports
              </span>
              {openMenu === "reports"
                ? <ChevronDown size={18} />
                : <ChevronRight size={18} />
              }
            </button>

            {openMenu === "reports" && (
              <div className="ml-6 mt-2 space-y-2 border-l border-white/30 pl-4">
                <Link to="/dashboard/reports/summary" className="block py-2 rounded hover:bg-white/10">Summary Report</Link>
                <Link to="/dashboard/reports/expiry" className="block py-2 rounded hover:bg-white/10">Expiry Report</Link>
              </div>
            )}
          </div> */}

          {/* ----- Settings ----- */}
          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-3 rounded-xl flex items-center gap-3 font-medium
              ${isActive("/settings") ? "bg-white text-[#8C00FF]" : "hover:bg-white/10"}
            `}
          >
            <Settings size={20} /> Settings
          </Link>

        </div>

        <div className="p-4 text-center text-xs opacity-70">v1.0.0 • EPR System</div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 md:hidden"></div>
      )}
    </>
  );
}
