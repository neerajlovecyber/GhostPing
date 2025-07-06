"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/icons";

export const Navbar = () => {
  const { user, isLoading, login, logout, isAuthenticated } = useAuth();

  const handleDashboardClick = () => {
    window.location.href = '/dashboard';
  };

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">ghostping.neerajlovecyber.com</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem>
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-default-200 animate-pulse" />
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">Welcome, {user.name}</span>
              <Button size="sm" variant="light" color="danger" onPress={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button color="primary" variant="flat" onPress={login}>
              Sign In with Google
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
      </NavbarMenu>
    </HeroUINavbar>
  );
};