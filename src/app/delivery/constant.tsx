import { SideNavItem } from "@/types/types";
import {
  IconHome,
  IconTruck,
  IconCircleCheck,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/delivery/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Active Deliveries",
    path: "/delivery/deliveries",
    icon: <IconTruck width="24" height="24" />,
  },
  {
    title: "Completed Orders",
    path: "/delivery/completed",
    icon: <IconCircleCheck width="24" height="24" />,
  },
];
