"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  DollarSign,
  CreditCard,
  UserCircle,
  Trash2,
} from "lucide-react";

const navItems = [
  { name: "My Profile", href: "/dashboard/profile", icon: UserCircle }, 
  { name: "Dashboard", href: "/dashboard/dashboard", icon: LayoutDashboard },
  { name: "Availability", href: "/dashboard/availability", icon: CalendarDays },
  { name: "Bookings", href: "/dashboard/bookings", icon: BookOpen },
  { name: "Earnings", href: "/dashboard/earnings", icon: DollarSign },
  { name: "Payouts", href: "/dashboard/payouts", icon: CreditCard },
 { name: "Delete Account", href: "/dashboard/delete-account", icon: Trash2 }
];
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:block">
      <nav className="sticky top-16 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}