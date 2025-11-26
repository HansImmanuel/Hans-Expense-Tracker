'use client'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs';
function Header() {

    const {user, isSignedIn} = useUser();
  return (
    <div className='p-5 flex justify-between items-center border shadow-md'>
        <Image
          src={'./logo.svg'}
          alt="Logo"
            width={160}
            height={100}
        />
        {isSignedIn? <div className='flex items-center gap-5'> <Link href="/dashboard">
            <Button variant='outline'>Dashboard</Button>
          </Link><UserButton /></div>: (
          <Link href="/sign-in">
            <Button>Get Started</Button>
          </Link>
        )}
    </div>
  )
}

export default Header