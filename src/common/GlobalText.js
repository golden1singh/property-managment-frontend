import {
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  KeyIcon,
  BeakerIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";
export const navigation = [
  {
    name: "dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "plots",
    href: "/plots",
    icon: BuildingOfficeIcon,
  },
  {
    name: "rooms",
    href: "/rooms",
    icon: KeyIcon,
  },
  {
    name: "tenants",
    href: "/tenants",
    icon: UsersIcon,
  },
  {
    name: "readings",
    href: "/readings",
    icon: BeakerIcon,
  },
  {
    name: "payments",
    href: "/payments",
    icon: BanknotesIcon,
  },
  {
    name: "rentCollection",
    href: "/rent-collection",
    icon: ReceiptRefundIcon,
  },
  // {
  //   name: "settings",
  //   href: "/settings",
  //   icon: Cog6ToothIcon,
  // },
];
