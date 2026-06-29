import { SideNavItem } from "@/types/types";
import { IconLayoutGrid, IconShoppingCart, IconHistory, IconMessage2 } from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/user/dashboard",
    icon: <IconLayoutGrid width="24" height="24" />,
  },
  {
    title: "Farm Marketplace",
    path: "/user/browse",
    icon: <IconShoppingCart width="24" height="24" />,
  },
  {
    title: "Bargains & Offers",
    path: "/user/negotiations",
    icon: <IconMessage2 width="24" height="24" />,
  },
  {
    title: "Purchase History",
    path: "/user/orders",
    icon: <IconHistory width="24" height="24" />,
  },
];
