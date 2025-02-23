import Link from "next/link"
import { LayoutDashboard, ShoppingBag, Users, Grid } from "lucide-react"

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/categories', label: 'Categories', icon: Grid },
  { href: '/admin/customers', label: 'Customers', icon: Users },
]
export function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 p-4 space-y-4 font-sans">
      <div className="text-xl font-bold p-4">Admin Panel</div>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-md"
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
} 