'use client'
import React, { useEffect } from 'react'
import { AppLogo } from './icons/AppLogo'
import { Combobox } from './ui/combobox'
import Link from 'next/link'

import { getStore } from '@/actions/open-fga.action'
import { setStoreState, setCurrentStoreState } from '@/stores/slice'
import { useAppDispatch, useAppSelector } from '@/stores/store'
import StoreForm from './from/StoreForm'
import StoreViewModal from './StoreModal'

export default function NavHeader() {
    const storeState = useAppSelector((state) => state.storeFga.store);
    const dispatch = useAppDispatch();
    const updateStoreList = async () => {
        const store = await getStore()
        if (store) {
            dispatch(setStoreState(store))
        }
    }
    useEffect(() => {
        updateStoreList()
    }, [])
    const handleSelect = (value: string) => {
        const currentStore = storeState.find((item) => item.id === value)
        if (currentStore) {
            dispatch(setCurrentStoreState(currentStore))
        }
    }
    return (
        <div className='flex justify-between items-center bg-black p-5 text-white'>
            <div className='flex gap-4 items-center'>
                <AppLogo />
                <Combobox defaultValue={storeState[0]?.id} 
                data={storeState.map((store) => ({ label: store.name, value: store.id }))} 
                onSelect={handleSelect} 
                />

                <Link href="#">
                    Join the community</Link>
                <Link href="#">
                    Docs</Link>
                <Link href="#">
                    TAKE A TOUR</Link>
            </div>
            <div className='flex gap-4 items-center'>
                <StoreForm />
                <StoreViewModal/>
            </div>
        </div>
    )
}
