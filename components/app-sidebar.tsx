"use client"

import { CreditCard, FolderOpenIcon, HistoryIcon, KeyIcon, StarIcon } from "lucide-react"

const menuItems = [
    {
        title:"Main",
        items:[
            {
                title:"workflows",
                icon: FolderOpenIcon,
                url: "/workflows"
            },
            {
                title:"Credentials",
                icon: KeyIcon,
                url: "/credentials"
            },
            {
                title:"Executions",
                icon: HistoryIcon,
                url: "/executions"
            }
        ]
    }
]

import React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSubButton } from "./ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { useHasActiveSubscription } from "@/features/payments/hooks/use-subscription"

const AppSidebar = () => {
    const router = useRouter()
    const pathname =  usePathname();
    const {hasActiveSubscription, isLoading} = useHasActiveSubscription()
  return (
    <Sidebar collapsible="icon">
        <SidebarHeader>
            <SidebarMenuItem>
                <SidebarMenuSubButton asChild className="h-10 px-4
                gap-x-4">
                    <Link href="/" prefetch>
                    <Image src="/images/logo.svg" alt="AIauto"
                    height={30} width={30}/>
                    <span className="font-semibold">
                        AIaotoresponder
                    </span>
                    </Link>
                </SidebarMenuSubButton>
            </SidebarMenuItem>
        </SidebarHeader>
        <SidebarContent>
            {
                menuItems.map((group)=>(
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                            {
                                group.items.map((item)=>(
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton 
                                        tooltip={item.title}
                                        isActive={
                                            item.url === "/" ? 
                                            pathname === "/"
                                            : pathname.startsWith(item.url)
                                        }
                                        asChild
                                        className="gap-x-4 h-10 px-4"
                                        >
                                            <Link href={item.url} prefetch>
                                            <item.icon className="size-4"/>
                                            <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))
            }
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                {!hasActiveSubscription && !isLoading &&(
                <SidebarMenuItem>
                    <SidebarMenuButton
                    tooltip="Upgrade to Pro"
                    className="gap-x-4 h-10 px-4"
                    onClick={()=>authClient.checkout({slug:"pro"})}
                    >
                        <StarIcon className="h-4 w-4"/>
                        <span>Upgrade to Pro</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>)}
                <SidebarMenuItem>
                    <SidebarMenuButton
                    tooltip="Billing Portal"
                    className="gap-x-4 h-10 px-4"
                    onClick={()=>authClient.customer.portal()}
                    >
                        <CreditCard className="h-4 w-4"/>
                        <span>Billing Portal</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                    tooltip="Sign Out"
                    className="gap-x-4 h-10 px-4"
                    onClick={()=> authClient.signOut({
                        fetchOptions:{
                            onSuccess:() => {
                                router.push("/login")
                            }
                        }
                    })}
                    >
                        <CreditCard className="h-4 w-4"/>
                        <span>Sign Out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar