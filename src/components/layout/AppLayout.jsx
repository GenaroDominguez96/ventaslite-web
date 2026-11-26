import { useState } from 'react'
import AppHeader from './AppHeader'
import AppSidebar from './AppSidebar'

function AppLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <AppSidebar open={menuOpen} onClose={closeMenu} />

      <div className="min-h-screen lg:pl-[258px]">
        <AppHeader onOpenMenu={() => setMenuOpen(true)} />

        <main className="px-4 py-7 md:px-8 md:py-9">
          {children}
        </main>

        <footer className="border-t border-slate-200/80 px-4 py-5 text-center text-[10px] text-slate-400 md:px-8">
          © {new Date().getFullYear()} VentasLite · Sistema de gestión comercial
        </footer>
      </div>
    </div>
  )
}

export default AppLayout
