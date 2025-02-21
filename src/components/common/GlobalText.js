import {
    XMarkIcon,
    HomeIcon,
    UsersIcon,
    BuildingOfficeIcon,
    KeyIcon,
    BeakerIcon,
    BanknotesIcon,
    Cog6ToothIcon
  } from '@heroicons/react/24/outline'
export const navigation = [
    {
      name: 'dashboard',
      href: '/dashboard',
      icon: HomeIcon
    },
    {
      name: 'plots',
      href: '/plots',
      icon: BuildingOfficeIcon
    },
    {
      name: 'rooms',
      href: '/rooms',
      icon: KeyIcon
    },
    {
      name: 'tenants',
      href: '/tenants',
      icon: UsersIcon
    },
    {
      name: 'readings',
      href: '/readings',
      icon: BeakerIcon
    },
    {
      name: 'payments',
      href: '/payments',
      icon: BanknotesIcon
    },
    {
      name: 'settings',
      href: '/settings',
      icon: Cog6ToothIcon
    }
  ]
  