import Navbar from '@/components/layouts/Header'
import { LayoutProps } from '@/types'
import React from 'react'

const Layout = ({children}:LayoutProps) => {
  return (
    <>
    <Navbar/>
    {children}
    </>
  )
}

export default Layout