"use client";

import {
  Bell,
  Search,
  UserCircle2,
  ChevronDown,
  Menu,
  LogOut,
  Settings,
  CheckCheck,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({
  onToggleSidebar,
}: NavbarProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Active System Monitoring",
      description:
        "Return and issue tracking systems are operational.",
      time: "Just now",
      unread: true,
    },
    {
      id: 2,
      title: "Member Registrations Active",
      description:
        "Members can complete profiles and request book loans.",
      time: "10m ago",
      unread: true,
    },
    {
      id: 3,
      title: "Stock Auto-Sync",
      description:
        "Book inventory availability updates automatically on return.",
      time: "1h ago",
      unread: false,
    },
  ]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }

      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Logout
  async function handleLogout() {
    await signOut({
      callbackUrl: "/librarian-login",
    });
  }

  // Search
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(
        `/dashboard/books?search=${encodeURIComponent(
          searchQuery.trim()
        )}`
      );
    }
  }

  // Mark all notifications as read
  function markAllNotificationsRead() {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        unread: false,
      }))
    );
  }

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  return (
    <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-10 shadow-sm relative z-30" style={{ padding: "10px" }}>
      {/* =========================
          LEFT SIDE
      ========================== */}
      <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0 max-w-2xl mr-2 sm:mr-4">
        {/* Hamburger */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="
            w-11 h-11 sm:w-12 sm:h-12
            rounded-2xl
            border border-slate-200
            text-slate-700
            hover:bg-slate-50
            flex
            items-center
            justify-center
            transition
            shadow-sm
            shrink-0
          "
          aria-label="Toggle Navigation Menu" style={{ marginLeft: "10px" }}
        >
          <Menu size={22} />
        </button>

        {/* Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full min-w-0 max-w-[430px]"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search"
            className="
              w-full
              h-11 sm:h-12
              rounded-2xl
              border border-slate-200
              bg-slate-50/70
              pl-4 sm:pl-5
              pr-11
              text-xs sm:text-sm
              text-slate-800
              placeholder:text-slate-400
              outline-none
              transition
              focus:border-blue-500
              focus:bg-white
              focus:ring-2
              focus:ring-blue-100
            " style={{ padding: "10px" }}
          />

          {/* Search icon on right */}
          <button
            type="submit"
            aria-label="Submit search"
            className="
              absolute
              right-3.5
              top-1/2
              -translate-y-1/2
              text-slate-400
              hover:text-blue-600
              transition
            "
          >
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* =========================
          RIGHT SIDE
      ========================== */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0" style={{ marginLeft: "10px" }}>
        {/* =========================
            NOTIFICATIONS
        ========================== */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            className="
              relative
              w-10 h-10 sm:w-11 sm:h-11
              rounded-2xl
              border border-slate-200
              text-slate-700
              hover:bg-slate-50
              flex
              items-center
              justify-center
              transition
              shadow-sm
              shrink-0
            "
            aria-label="View Notifications"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="
                absolute
                -top-1
                -right-1
                w-5
                h-5
                rounded-full
                bg-red-500
                text-white
                text-[11px]
                font-bold
                flex
                items-center
                justify-center
                ring-2
                ring-white
              ">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="
              absolute
              right-0
              mt-3
              w-80 sm:w-96
              rounded-3xl
              bg-white
              p-4
              shadow-2xl
              border
              border-slate-100
              z-50
            ">
              {/* Notification Header */}
              <div className="
                flex
                items-center
                justify-between
                pb-3
                border-b
                border-slate-100
              " style={{ padding: "10px" }}>
                <div>
                  <h4 className="
                    font-bold
                    text-slate-900
                    text-sm
                  ">
                    Notifications
                  </h4>

                  <p className="
                    text-xs
                    text-slate-400
                  " >
                    Library updates & alerts
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="
                      text-xs
                      text-blue-600
                      hover:text-blue-700
                      font-semibold
                      flex
                      items-center
                      gap-1
                    "
                  >
                    <CheckCheck size={14} style={{ marginRight: "5px" }} />
                    Mark read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="
                mt-3
                space-y-2
                max-h-72
                overflow-y-auto
              ">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`
                      p-3
                      rounded-2xl
                      text-left
                      transition
                      ${item.unread
                        ? "bg-blue-50/70"
                        : "hover:bg-slate-50"
                      }
                    `}
                  >
                    <div className="
                      flex
                      items-center
                      justify-between
                    ">
                      <h5 className="
                        text-xs
                        font-bold
                        text-slate-800
                      ">
                        {item.title}
                      </h5>

                      <span className="
                        text-[10px]
                        text-slate-400
                        font-medium
                      ">
                        {item.time}
                      </span>
                    </div>

                    <p className="
                      text-xs
                      text-slate-600
                      mt-1
                      leading-relaxed
                    ">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =========================
            PROFILE
        ========================== */}
        <div
          className="relative shrink-0"
          ref={profileRef} style={{ marginLeft: "10px" }}
        >
          <button
            type="button"
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotifOpen(false);
            }}
            className="
              flex
              items-center
              gap-2 sm:gap-3
              rounded-2xl
              border border-slate-200
              bg-white
              p-1.5
              pr-2.5 sm:pr-3
              hover:bg-slate-50
              transition
              shadow-sm
            " style={{ padding: "10px" }}
          >
            <UserCircle2
              size={36}
              className="text-[#2952F3] shrink-0"
            />

            <div className="text-left hidden md:block">
              <h3 className="
                font-bold
                text-sm
                text-slate-900
                leading-tight
              ">
                {session?.user?.name || "Librarian"}
              </h3>

              <p className="
                text-xs
                text-slate-500
                capitalize
              ">
                {session?.user?.role || "Administrator"}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="text-slate-400"
            />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="
              absolute
              right-0
              mt-3
              w-60
              rounded-3xl
              bg-white
              p-3
              shadow-2xl
              border
              border-slate-100
              z-50
            " style={{ padding: "20px" }}>
              {/* User Information */}
              <div className="
                px-3
                py-2.5
                border-b
                border-slate-100
              ">
                <p className="
                  font-bold
                  text-sm
                  text-slate-900
                  truncate
                ">
                  {session?.user?.name || "Librarian"}
                </p>

                <p className="
                  text-xs
                  text-slate-400
                  truncate
                  mt-0.5
                ">
                  {session?.user?.email ||
                    "librarian@library.com"}
                </p>

                <span className="
                  inline-block
                  mt-2
                  text-[11px]
                  font-semibold
                  text-blue-700
                  bg-blue-50
                  px-2.5
                  py-0.5
                  rounded-full
                  capitalize
                " style={{ marginTop: "10px", padding: "10px" }}>
                  {session?.user?.role || "Administrator"}
                </span>
              </div>

              {/* Settings */}
              <div className="py-2 space-y-1" style={{ padding: "10px" }}>
                <Link
                  href="/dashboard/settings"
                  onClick={() =>
                    setProfileOpen(false)
                  }
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    rounded-xl
                    text-sm
                    font-medium
                    text-slate-700
                    hover:bg-slate-50
                    transition
                  "
                >
                  <Settings
                    size={16}
                    className="text-slate-400"
                  />

                  <span>Settings</span>
                </Link>
              </div>

              {/* Logout */}
              <div className="
                border-t
                border-slate-100
                pt-1
              " style={{ padding: "10px" }}>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    rounded-xl
                    text-sm
                    font-medium
                    text-red-600
                    hover:bg-red-50
                    transition
                  "
                >
                  <LogOut size={16} />

                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}