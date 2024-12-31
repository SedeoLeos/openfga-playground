import React from 'react'
import { AppLogo } from './icons/AppLogo'
import { Combobox } from './ui/combobox'
import Link from 'next/link'
import { Button } from './ui/button'

export default function NavHeader() {
    return (
        <div className='flex justify-between items-center bg-black p-5 text-white'>
            <div className='flex gap-4 items-center'>
                <AppLogo />
                <Combobox />
                <Link href="#">
                    Join the community</Link>
                <Link href="#">
                    Docs</Link>
                <Link href="#">
                    TAKE A TOUR</Link>
            </div>
            <div className='flex gap-4 items-center'>
                <Button>NEW STORE</Button>
                <Button>SIGN UP</Button>
            </div>
        </div>
    )
}
