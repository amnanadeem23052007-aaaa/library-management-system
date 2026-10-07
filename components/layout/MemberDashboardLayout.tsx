"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  History,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  AlertTriangle,
  ChevronDown,
  UserCircle2,
  CheckCheck,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useMemberRefresh } from "@/components/member/MemberRefreshContext";

interface MemberDashboardLayoutProps {
  children: React.ReactNode;
}

export default function MemberDashboardLayout({
  children,
}: MemberDashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { refreshKey } = useMemberRefresh();

  // Desktop sidebar open/close & mobile drawer
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Popover states
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Profile completion status
  const [profile, setProfile] = useState<any>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Welcome to Library System",
      description:
        "Complete your profile to browse and borrow books from the collection.",
      time: "Just now",
      unread: true,
    },
    {
      id: 2,
      title: "Loan Period",
      description:
        "All borrowed books are issued for a standard 14-day duration.",
      time: "Notice",
      unread: true,
    },
    {
      id: 3,
      title: "Rating & Reviews",
      description:
        "You can rate any book (1 to 5 stars) and leave reviews directly in Browse Books.",
      time: "Info",
      unread: false,
    },
  ]);

  // Close profile/notification dropdown when clicking outside
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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check member profile completion
  useEffect(() => {
    async function checkProfile() {
      try {
        const res = await fetch("/api/member/profile", {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success && data.member) {
          setProfile(data.member);

          const isComplete =
            data.member.isProfileComplete ||
            Boolean(
              data.member.name?.trim() &&
              data.member.phone?.trim() &&
              data.member.address?.trim()
            );

          if (!isComplete && pathname !== "/member/profile") {
            router.replace("/member/profile");
          }
        }
      } catch (err) {
        console.error("Profile check error:", err);
      } finally {
        setCheckingProfile(false);
      }
    }

    checkProfile();
  }, [pathname, refreshKey, router]);

  const navItems = [
    {
      name: "Dashboard",
      href: "/member",
      icon: LayoutDashboard,
    },
    {
      name: "Browse Books",
      href: "/member/browse",
      icon: Search,
    },
    {
      name: "My Books",
      href: "/member/books",
      icon: BookOpen,
    },
    {
      name: "Borrowing History",
      href: "/member/history",
      icon: History,
    },
    {
      name: "My Profile",
      href: "/member/profile",
      icon: User,
    },
  ];

  // Logout
  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: "/member-login",
        redirect: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      window.location.href = "/member-login";
    }
  };

  // Search
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(
        `/member/browse?search=${encodeURIComponent(
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

  const isComplete =
    profile?.isProfileComplete ||
    Boolean(
      profile?.name?.trim() &&
      profile?.phone?.trim() &&
      profile?.address?.trim()
    );

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const memberName =
    profile?.name || session?.user?.name || "Member";

  const memberEmail =
    profile?.email ||
    session?.user?.email ||
    "member@library.com";

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 transition-colors duration-200" >
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
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
          overflow: !sidebarOpen && !mobileOpen ? "hidden" : "visible",
        }}
      >
        {/* Brand Header */}
        <div className="h-24 flex items-center px-4 sm:px-6 border-b border-white/10" style={{ padding: "10px" }}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-lg flex items-center justify-center text-3xl shrink-0">
                📚
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold leading-none whitespace-nowrap">
                  Library
                </h1>
                <p className="text-sm text-blue-100 mt-1 whitespace-nowrap">
                  Member Portal
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 lg:hidden shrink-0"
              aria-label="Close sidebar"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-2 sm:px-4 py-8 overflow-y-auto">
          <div className="space-y-2 flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isLocked =
                !checkingProfile &&
                !isComplete &&
                item.href !== "/member/profile";

              const active =
                item.href === "/member"
                  ? pathname === "/member"
                  : pathname === item.href ||
                  pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={isLocked ? "/member/profile" : item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    group
                    flex
                    items-center
                    justify-between
                    rounded-2xl
                    px-5
                    py-3.5
                    transition-all
                    duration-200
                    ${active
                      ? "bg-white text-[#1838D1] shadow-lg shadow-black/10 font-bold"
                      : isLocked
                        ? "text-white/40 hover:bg-white/5 cursor-not-allowed"
                        : "text-white/85 hover:bg-white/15 hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-4" style={{ padding: "10px" }}>
                    <Icon
                      size={22}
                      className={`
                        shrink-0
                        transition-transform
                        duration-200
                        ${active
                          ? "text-[#1838D1]"
                          : isLocked
                            ? "text-white/40"
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
                          : isLocked
                            ? "text-white/40 font-medium"
                            : "text-white/90 group-hover:text-white font-medium"
                        }
                      `}
                    >
                      {item.name}
                    </span>
                  </div>

                  {isLocked && (
                    <span className="text-[10px] bg-amber-400/30 text-amber-200 px-2 py-0.5 rounded-full font-semibold">
                      Locked
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Logout Button */}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0" >
        {/* Navbar */}
        <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-10 shadow-sm relative z-30" style={{ padding: "20px" }}>
          {/* Left: Toggle & Search */}
          <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0 max-w-2xl mr-2 sm:mr-4">
            <button
              type="button"
              onClick={() => {
                if (
                  typeof window !== "undefined" &&
                  window.innerWidth < 1024
                ) {
                  setMobileOpen((prev) => !prev);
                } else {
                  setSidebarOpen((prev) => !prev);
                }
              }}
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
              aria-label="Toggle Navigation Menu"
            >
              <Menu size={22} />
            </button>

            {/* Global Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full min-w-0 max-w-[430px]"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search "
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

          {/* Right: Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0" >
            {/* Notification Bell */}
            <div className="relative" style={{marginLeft:"10px"}}  ref={notifRef}>
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
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100" style={{ padding: "20px" }}>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Notifications
                      </h4>
                      <p className="text-xs text-slate-400">
                        Library notices & loans
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                      >
                        <CheckCheck size={14} className="mr-0.5" />
                        Mark read
                      </button>
                    )}
                  </div>

                  <div className="mt-3 space-y-2 max-h-72 overflow-y-auto" >
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
                        <div className="flex items-center justify-between" >
                          <h5 className="text-xs font-bold text-slate-800">
                            {item.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.time}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative shrink-0" ref={profileRef} >
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

                <div className="text-left hidden md:block" >
                  <h3 className="font-bold text-sm text-slate-900 leading-tight" >
                    {memberName}
                  </h3>

                  <p className="text-xs text-slate-500 capitalize">
                    Member
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className="text-slate-400"
                />
              </button>

              {/* Profile Dropdown Menu */}
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
                ">
                  <div className="px-3 py-2.5 border-b border-slate-100" style={{ padding: "20px" }}>
                    <p className="font-bold text-sm text-slate-900 truncate">
                      {memberName}
                    </p>

                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {memberEmail}
                    </p>

                    <span className="inline-block mt-2 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full capitalize">
                      Member
                    </span>
                  </div>

                  <div className="py-2 space-y-1" style={{ padding: "20px" }}>
                    <Link
                      href="/member/profile"
                      onClick={() => setProfileOpen(false)}
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
                      <User size={16} className="text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/member/books"
                      onClick={() => setProfileOpen(false)}
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
                      <BookOpen size={16} className="text-slate-400" />
                      <span>My Books</span>
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1" style={{ padding: "20px" }}>
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

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 pb-12 overflow-y-auto">
          <div className="max-w-[1600px] w-full mx-auto">
            {/* Profile Completion Warning */}
            {!checkingProfile && profile && !isComplete && (
              <div className="mb-6 sm:mb-8 rounded-3xl border border-amber-300 bg-amber-50 p-6 text-amber-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />

                  <div>
                    <h3 className="font-bold text-sm text-amber-900">
                      Profile Incomplete — Book Access Locked
                    </h3>

                    <p className="mt-0.5 text-xs text-amber-800">
                      You must complete your profile with your phone number and physical address before you can browse or borrow books.
                    </p>
                  </div>
                </div>

                {pathname !== "/member/profile" && (
                  <Link
                    href="/member/profile"
                    className="
                      rounded-2xl
                      bg-amber-600
                      px-5
                      py-2.5
                      text-xs
                      font-bold
                      text-white
                      hover:bg-amber-700
                      shrink-0
                      transition
                      shadow-sm
                    "
                  >
                    Complete Profile Now →
                  </Link>
                )}
              </div>
            )}

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}