import { SideNavItem } from "@/types/types";
import {
  IconHome,
  IconPlus,
  IconPackages,
  IconClipboardCheck,
  IconCurrencyRupee,
  IconMessage2
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/farmer/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Add Product",
    path: "/farmer/add-product",
    icon: <IconPlus width="24" height="24" />,
  },
  {
    title: "Incoming Bargains",
    path: "/farmer/negotiations",
    icon: <IconMessage2 width="24" height="24" />,
  },
  {
    title: "My Products",
    path: "/farmer/products",
    icon: <IconPackages width="24" height="24" />,
  },
  {
    title: "My Orders",
    path: "/farmer/orders",
    icon: <IconClipboardCheck width="24" height="24" />,
  },
  {
    title: "My Earnings",
    path: "/farmer/earnings",
    icon: <IconCurrencyRupee width="24" height="24" />,
  },
];
