'use client'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs';
function DashboardHeader() {

    const {user, isSignedIn} = useUser();
  return (
    <div className='p-5 flex items-center border shadow-md'>
      <div className='ml-auto'>
        {isSignedIn? <UserButton /> : (
          <Link href="/sign-in">
            <Button>Get Started</Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default DashboardHeader