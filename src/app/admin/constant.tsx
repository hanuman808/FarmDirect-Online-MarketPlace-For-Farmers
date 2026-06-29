import { SideNavItem } from "@/types/types";
import {
  IconHome,
  IconUsers,
  IconTruck,
  IconPackage,
  IconChartBar
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/admin/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Approve Users",
    path: "/admin/manage-farmers",
    icon: <IconUsers width="24" height="24" />,
  },
  {
    title: "All Products",
    path: "/admin/products",
    icon: <IconPackage width="24" height="24" />,
  },
  {
    title: "All Deliveries",
    path: "/admin/manage-deliveries",
    icon: <IconTruck width="24" height="24" />,
  },
  {
    title: "Reports & Analytics",
    path: "/admin/analytics",
    icon: <IconChartBar width="24" height="24" />,
  },
];
