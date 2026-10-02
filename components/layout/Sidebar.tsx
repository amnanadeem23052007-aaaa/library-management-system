"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  BookOpen,
  Users,
  BookMarked,
  RotateCcw,
  Trash2,
  UserRound,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import { signOut } from "next-auth/react";

const menus = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    link: "/dashboard",
  },
  {
    name: "Books",
    icon: BookOpen,
    link: "/dashboard/books",
  },
  {
    name: "Members",
    icon: Users,
    link: "/dashboard/members",
  },
  {
    name: "Issued Books",
    icon: BookMarked,
    link: "/dashboard/issue-books",
  },
  {
    name: "Return Books",
    icon: RotateCcw,
    link: "/dashboard/return-books",
  },
  {
    name: "Deleted Books",
    icon: Trash2,
    link: "/dashboard/deleted-books",
  },
  {
    name: "Deleted Members",
    icon: Trash2,
    link: "/dashboard/deleted-members",
  },
  {
    name: "Users",
    icon: UserRound,
    link: "/dashboard/users",
  },
  {
    name: "Settings",
    icon: Settings,
    link: "/dashboard/settings",
  },
];

interface SidebarProps {
  sidebarOpen?: boolean;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  sidebarOpen = true,
  mobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  async function handleLogout() {
    await signOut({
      callbackUrl: "/librarian-login",
    });
  }

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 lg:static
        min-h-screen
        bg-gradient-to-b
        from-[#1838D1]
        via-[#233BD7]
        to-[#171E74]
        text-white
        flex flex-col
        shadow-2xl
        transition-all duration-300 ease-in-out
        ${mobileOpen
          ? "translate-x-0 w-[280px]"
          : "-translate-x-full lg:translate-x-0"
        }
        ${sidebarOpen
          ? "lg:w-[280px] lg:opacity-100"
          : "lg:w-0 lg:opacity-0 lg:pointer-events-none"
        }
      `}
      style={{
        padding: sidebarOpen || mobileOpen ? "20px" : "0px",
        overflow:
          !sidebarOpen && !mobileOpen ? "hidden" : "visible",
      }}
    >
      {/* Logo */}
      <div className="h-24 flex items-center px-4 sm:px-6 border-b border-white/10">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div
              className="
                w-14 h-14
                rounded-2xl
                bg-white/10
                backdrop-blur-lg
                flex items-center justify-center
                text-3xl
                shrink-0
              "
            >
              📚
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold leading-none whitespace-nowrap">
                Library
              </h1>

              <p className="text-sm text-blue-100 mt-1 whitespace-nowrap">
                Management System
              </p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 lg:hidden shrink-0"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 px-2 sm:px-4 py-8 overflow-y-auto">
        <div className="space-y-2 flex flex-col gap-1.5">
          {menus.map((item) => {
            const Icon = item.icon;

            const active =
              item.link === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.link ||
                pathname.startsWith(item.link + "/");

            return (
              <Link
                key={item.name}
                href={item.link}
                onClick={() => onCloseMobile?.()}
                className={`
                  group
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  px-5
                  py-3.5
                  transition-all
                  duration-200
                  ${active
                    ? "bg-white text-[#1838D1] shadow-lg shadow-black/10 font-bold"
                    : "text-white/85 hover:bg-white/15 hover:text-white"
                  }
                `}
              >
                <Icon
                  size={22}
                  className={`
                    shrink-0
                    transition-transform
                    duration-200
                    ${active
                      ? "text-[#1838D1]"
                      : "text-white/85 group-hover:text-white group-hover:scale-110"
                    }
                  `}
                />

                <span
                  className={`
                    text-[15px]
                    whitespace-nowrap
                    transition-colors
                    duration-200
                    ${active
                      ? "text-[#1838D1] font-bold"
                      : "text-white/90 group-hover:text-white font-medium"
                    }
                  `} style={{ padding: "10px" }}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="
            w-full
            rounded-2xl
            bg-gradient-to-r
            from-red-500
            to-red-600
            py-3.5
            font-semibold
            flex
            items-center
            justify-center
            gap-3
            transition
            hover:scale-[1.02]
            hover:shadow-xl
            text-white
          "
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
} 