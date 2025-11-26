import { Calendar, Disc2, CircleSmall } from "lucide-react"

import Image from "next/image"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: CircleSmall,
  },
  {
    title: "Budgets",
    url: "/dashboard/budgets",
    icon: CircleSmall,  
  },
  {
    title: "Expenses",
    url: "/dashboard/expenses",
    icon: CircleSmall,
  }

]

export function AppSidebar() {
  return (
    <Sidebar>
    <SidebarHeader>
        <div className='p-5 flex justify-between items-center'>
                <Image
                  src={'/logo.svg'}
                  alt="Logo"
                    width={180}
                    height={100}
                />
        </div>
    </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Paths</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
              <div className='p-5 w-60 flex gap-5 items-center border'>
                <UserButton />
                <span className="text-sm text-gray-500 dark:text-gray-400">Hans Expense Tracker</span>
              </div>
      </SidebarFooter>
    </Sidebar>
  )
}