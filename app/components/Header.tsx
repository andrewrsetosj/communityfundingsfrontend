"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";

const categories = [
  {
    name: "Health",
    slug: "health",
    iconPath: "M4.5 12.75l6 6 9-13.5",
  },
  {
    name: "Technology",
    slug: "technology",
    iconPath: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    name: "Food",
    slug: "food",
    iconPath: "M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z",
  },
  {
    name: "Art",
    slug: "art",
    iconPath: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42",
  },
  {
    name: "Film & Video",
    slug: "film-and-video",
    iconPath: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z",
  },
  {
    name: "Games",
    slug: "games",
    iconPath: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
  },
  {
    name: "Music",
    slug: "music",
    iconPath: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
  },
  {
    name: "Publishing",
    slug: "publishing",
    iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
];

type NotificationActor = {
  creator_id?: string | null;
  name?: string | null;
  last_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
};

type NotificationItem = {
  notification_id: number;
  recipient_creator_id: string;
  actor_creator_id?: string | null;
  type: string;
  title: string;
  body?: string | null;
  link_url?: string | null;
  campaign_id?: number | null;
  comment_id?: number | null;
  collaborator_id?: number | null;
  is_read: boolean;
  time_created: string;
  actor?: NotificationActor | null;
};

function formatTimeAgo(dateString?: string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const seconds = Math.max(1, Math.floor(diffMs / 1000));
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileUsername, setProfileUsername] = useState<string | null>(null);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [isNotificationsRefreshing, setIsNotificationsRefreshing] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  function getAuthHeaders(): Record<string, string> {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("cf_backend_token");
    if (!token || token === "undefined" || token === "null") return {};
    return { Authorization: `Bearer ${token}` };
  }

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearch();
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeSearch]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

useEffect(() => {
  if (!user?.id) {
    setNotifications([]);
    setUnreadCount(0);
    return;
  }

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("cf_backend_token")
      : null;

  if (!token || token === "undefined" || token === "null") {
    return;
  }

  let cancelled = false;

  (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/notifications/unread-count`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const json = await res.json();
      if (!cancelled) {
        setUnreadCount(Number(json.unread_count || 0));
      }
    } catch (err) {
      console.error("Error fetching unread notifications:", err);
    }
  })();

  return () => {
    cancelled = true;
  };
}, [user?.id, API_BASE]);

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/notifications/unread-count`, {
          cache: "no-store",
          headers: getAuthHeaders(),
        });
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled) {
          setUnreadCount(Number(json.unread_count || 0));
        }
      } catch (err) {
        console.error("Error fetching unread notifications:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, API_BASE]);

  async function refreshNotifications() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("cf_backend_token")
      : null;

  if (!token || token === "undefined" || token === "null") {
    return;
  }

  try {
    setIsNotificationsRefreshing(true);

    const res = await fetch(`${API_BASE}/api/notifications/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

      if (!res.ok) {
        throw new Error(`Failed to refresh notifications: ${res.status}`);
      }

      const json = await res.json();
      setUnreadCount(Number(json.unread_count || 0));
    } catch (err) {
      console.error(err);
    } finally {
      setIsNotificationsRefreshing(false);
    }
  }

  async function loadNotifications() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("cf_backend_token")
      : null;

  if (!token || token === "undefined" || token === "null") {
    return;
  }

  try {
    setIsNotificationsLoading(true);

    const res = await fetch(`${API_BASE}/api/notifications?limit=20`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

      if (!res.ok) {
        throw new Error(`Failed to load notifications: ${res.status}`);
      }

      const json = await res.json();
      setNotifications(Array.isArray(json.notifications) ? json.notifications : []);
      setUnreadCount(Number(json.unread_count || 0));
    } catch (err) {
      console.error(err);
    } finally {
      setIsNotificationsLoading(false);
    }
  }

  async function handleRefreshAndLoad() {
    await refreshNotifications();
    await loadNotifications();
  }

  async function handleNotificationsToggle() {
    const next = !isNotificationsOpen;
    setIsNotificationsOpen(next);

    if (next) {
      await handleRefreshAndLoad();
    }
  }

  async function handleNotificationClick(notification: NotificationItem) {
    try {
      if (!notification.is_read) {
        const res = await fetch(`${API_BASE}/api/notifications/${notification.notification_id}/read`, {
          method: "POST",
          headers: getAuthHeaders(),
        });

        if (res.ok) {
          setNotifications((prev) =>
            prev.map((item) =>
              item.notification_id === notification.notification_id
                ? { ...item, is_read: true }
                : item
            )
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsNotificationsOpen(false);
      if (notification.link_url) {
        router.push(notification.link_url);
      }
    }
  }

  async function handleDeleteNotification(notificationId: number, event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    try {
      const target = notifications.find((item) => item.notification_id === notificationId);

      const res = await fetch(`${API_BASE}/api/notifications/${notificationId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Failed to delete notification: ${res.status}`);
      }

      setNotifications((prev) => prev.filter((item) => item.notification_id !== notificationId));

      if (target && !target.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleMarkAllRead() {
    try {
      const res = await fetch(`${API_BASE}/api/notifications/read-all`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Failed to mark all notifications as read: ${res.status}`);
      }

      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  }

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeSearch();
    }
  };

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" });
  };


useEffect(() => {
  if (!user?.id) {
    setProfileUsername(null);
    return;
  }

  let cancelled = false;

  (async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE}/api/users/${user.id}`, { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      if (!cancelled) setProfileUsername(json.username || json.id || null);
    } catch (err) {
      console.error("Error fetching username:", err);
    }
  })();

  return () => {
    cancelled = true;
  };
}, [user?.id]);

const profileHref =
  pathname === "/settings"
    ? user?.id
      ? `/profile/${user.id}`
      : "#"
    : profileUsername
      ? `/profile/${profileUsername}`
      : user?.id
        ? `/profile/${user.id}`
        : "#";

  return (
    <header className="w-full">
      <div className="bg-[#8BC34A] text-white text-center py-2 text-sm">
        Community Funding is a project we&apos;re building together. Stay informed with our new blog, Project Updates.
      </div>

      <nav className="bg-white border-b border-gray-100 px-20 py-4">
        <div className="mx-auto flex items-center justify-between">
          {isSearchOpen ? (
            <div ref={searchRef} className="flex items-center gap-3 w-full">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 w-full">
                <div className="relative flex-1">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search campaigns..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                    onKeyDown={(event) => {
                      if (event.key === "Escape") closeSearch();
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={closeSearch}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="hidden md:flex items-center space-x-10 text-md text-gray-700 flex-1">
                <Link href="/about-us" className="hover:text-[#8BC34A] transition-colors">
                  About Us
                </Link>
                <Link href="/how-it-works" className="hover:text-[#8BC34A] transition-colors">
                  How it Works
                </Link>
                <Link href="/projects-we-love" className="hover:text-[#8BC34A] transition-colors">
                  Campaigns We Love
                </Link>

                <div className="relative" ref={categoriesRef}>
                  <button
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="flex items-center hover:text-[#8BC34A] transition-colors"
                  >
                    Categories
                    <svg
                      className={`w-4 h-4 ml-1 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isCategoriesOpen && (
                    <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-3 z-50">
                      <div className="grid grid-cols-2 gap-1 px-2">
                        {categories.map((category) => (
                          <Link
                            key={category.slug}
                            href={`/categories/${category.slug}`}
                            onClick={() => setIsCategoriesOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-[#8BC34A]/10 hover:text-[#8BC34A] rounded-md transition-colors"
                          >
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={category.iconPath}
                              />
                            </svg>
                            {category.name}
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-gray-100 mt-2 pt-2 px-2">
                        <Link
                          href="/categories"
                          onClick={() => setIsCategoriesOpen(false)}
                          className="block px-3 py-2 text-sm font-medium text-[#8BC34A] hover:bg-[#8BC34A]/10 rounded-md transition-colors"
                        >
                          View All Categories
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Link href="/" className="flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Community Fundings"
                  width={160}
                  height={48}
                  className="object-contain"
                  priority
                />
              </Link>

              <div className="flex items-center space-x-6 flex-1 justify-end">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-500 hover:text-[#8BC34A] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                <SignedOut>
                  <Link
                    href="/sign-in"
                    className="bg-[#8BC34A] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#7CB342] transition-colors"
                  >
                    Log In
                  </Link>
                </SignedOut>

                <SignedIn>
                  <div className="relative" ref={notificationsRef}>
                    <button
                      onClick={handleNotificationsToggle}
                      className="relative text-gray-500 hover:text-[#8BC34A] transition-colors"
                      aria-label="Notifications"
                    >
                      <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>

                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8BC34A] text-white text-[10px] font-semibold flex items-center justify-center">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </button>

                    {isNotificationsOpen && (
                      <div className="absolute right-0 mt-2 w-[360px] max-w-[90vw] bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Notifications</p>
                            <p className="text-xs text-gray-500">{unreadCount} unread</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleRefreshAndLoad}
                              disabled={isNotificationsRefreshing || isNotificationsLoading}
                              className="text-xs font-medium text-gray-600 hover:text-[#8BC34A] disabled:opacity-50"
                            >
                              {isNotificationsRefreshing ? "Refreshing..." : "Refresh"}
                            </button>

                            {notifications.length > 0 && unreadCount > 0 && (
                              <button
                                onClick={handleMarkAllRead}
                                className="text-xs font-medium text-[#8BC34A] hover:underline"
                              >
                                Mark all as read
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="max-h-[420px] overflow-y-auto">
                          {isNotificationsLoading ? (
                            <div className="px-4 py-6 text-sm text-gray-500">
                              Loading notifications...
                            </div>
                          ) : notifications.length === 0 ? (
                            <div className="px-4 py-8 text-sm text-gray-500 text-center">
                              No notifications yet.
                            </div>
                          ) : (
                            notifications.map((notification) => {
                              const actorName =
                                [notification.actor?.name, notification.actor?.last_name]
                                  .filter(Boolean)
                                  .join(" ")
                                  .trim() ||
                                notification.actor?.username ||
                                "Someone";

                              return (
                                <button
                                  key={notification.notification_id}
                                  onClick={() => handleNotificationClick(notification)}
                                  className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                    !notification.is_read ? "bg-[#F5F9F0]" : "bg-white"
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                      {notification.actor?.avatar_url ? (
                                        <Image
                                          src={notification.actor.avatar_url}
                                          alt={actorName}
                                          fill
                                          className="object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                                          {actorName?.[0]?.toUpperCase() ?? "N"}
                                        </div>
                                      )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                            {notification.title}
                                          </p>

                                          {notification.body ? (
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                              {notification.body}
                                            </p>
                                          ) : null}

                                          <p className="text-xs text-gray-400 mt-1">
                                            {formatTimeAgo(notification.time_created)}
                                          </p>
                                        </div>

                                        <button
                                          onClick={(event) =>
                                            handleDeleteNotification(notification.notification_id, event)
                                          }
                                          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                          aria-label="Delete notification"
                                        >
                                          <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M6 18L18 6M6 6l12 12"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center focus:outline-none"
                    >
                      {user?.imageUrl ? (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={user.imageUrl}
                            alt="Profile"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
                      )}
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <Link
                          href={profileHref}
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.fullName || user?.firstName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.primaryEmailAddress?.emailAddress}
                          </p>
                        </Link>

                        <Link
                          href="/settings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Profile Settings
                        </Link>

                        <Link
                          href="/ledger"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          Ledger
                        </Link>
                        <Link
                          href="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                          Business Admin
                        </Link>
                        <Link
                          href="/my-projects"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                          My Campaigns
                        </Link>

                        <Link
                          href="/drafts"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          My Drafts
                        </Link>

                        <Link
                          href="/saved"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          </svg>
                          Saved Campaigns
                        </Link>

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </SignedIn>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
