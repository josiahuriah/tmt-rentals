import { Nav, NavLink } from "@/components/Nav"

// forcing dynamic loading, avoiding caching to keep admin page up to date
export const dynamic = "force-dynamic" 

export default function AdminLayout({
    children,

}: Readonly<{
    children: React.ReactNode
}>) {
    return <>
    <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/bookings">Bookings</NavLink>
        <NavLink href="/admin/cars">Cars</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
    </Nav>
    <div className="container my-6"> {children} </div>
    </>
}