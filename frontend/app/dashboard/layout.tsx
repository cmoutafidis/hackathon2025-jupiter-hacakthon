"use client"

import { useState, useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Derive page title from pathname
  const pageTitle = useMemo(() => {
    const path = pathname.split("/").pop() || "dashboard"
    return path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }, [pathname])

  // Responsive sidebar state for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900/95 via-purple-900/95 to-slate-900/95">
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900/95 via-purple-900/95 to-slate-900/95 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/5 to-purple-100/5" />
      
      {/* Refined grid background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] md:bg-[size:32px_32px]" />
      
      {/* Main layout */}
      <div className="flex">
        <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        
        <div
          className={cn(
            "flex-1 transition-all duration-300 min-h-screen",
            sidebarOpen ? "md:ml-64 ml-0" : "md:ml-16 ml-0"
          )}
        >
          
          <main className="py-8 px-4 md:px-12 max-w-[1400px] mx-auto">
            {children}
          </main>
        </div>
      </div>

   </div>

  )
}