import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Folder, Smile, Users } from "lucide-react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: "/commesse", label: "Commesse", icon: <Folder size={18} /> },
    { path: "/tecnici", label: "Tecnici", icon: <Users size={18} /> },
   // { path: "/survey", label: "Business Happiness", icon: <Smile size={18} /> },
  ];

  const titleMap: Record<string, string> = {
    "/commesse": "📋 REPORT COMMESSE",
    "/tecnici": "📊 RIEPILOGO TECNICI PER BEEGREEN",
    //"/survey": "😊 BUSINESS HAPPINESS",
  };

  const pageTitle = titleMap[location.pathname] ?? "🔍 Applicazione";

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-br from-[#d3e9e8] to-[#147a64]">
      {/* Toolbar (fissa in alto) */}
      <header className="bg-[#2a4d50] text-white px-6 py-3 flex justify-between items-center shadow-md z-20">
        <button
          onClick={() => setOpen(!open)}
          className="hover:bg-[#3a6964] p-2 rounded transition cursor-pointer"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-semibold flex items-center gap-2">
          {pageTitle}
        </h1>
        <span className="opacity-0">Icono</span>
      </header>

      {/* Layout principale */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (slide con animazione) */}
        <aside
          className={`transition-all duration-300 ease-in-out bg-gradient-to-b from-[#c8ebe9] to-[#93d6cc] text-[#2a4d50] shadow-md
            ${open ? "w-64" : "w-0"} overflow-hidden`}
        >
          <div className="p-6 h-full flex flex-col">
            {/* Info utente */}
            <div className="mb-8 text-center">
              <div className="w-20 h-20 bg-white rounded-full mx-auto mb-3 shadow" />
              <h2 className="font-bold">Utente</h2>
              <p className="text-sm text-[#2a4d50]/80">utente@email.com</p>
            </div>

            {/* Navigazione */}
            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#bde3de] transition cursor-pointer ${
                    location.pathname === item.path ? "bg-[#a4dad2] font-semibold" : ""
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Contenuto scrollabile */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col min-h-full">

          {children}
        </main>
      </div>
    </div>
  );
}
