'use client'
import Link from 'next/link'
import { useCallback, useEffect } from 'react'
import { AppLogo } from './icons/AppLogo'
import { Combobox } from './ui/combobox'

import { getStore } from '@/actions/open-fga.action'
import { copyToClipboard } from '@/lib/utils'
import { setCurrentStoreState, setStoreState } from '@/stores/slice'
import { useAppDispatch, useAppSelector } from '@/stores/store'
import StoreForm from './from/StoreForm'
import StoreViewModal from './StoreModal'
import { MenubarDemo } from './ui/Menu'

export default function NavHeader() {
    const storeState = useAppSelector((state) => state.storeFga.store);
    const currentStore = useAppSelector((state) => state.storeFga.currentStore);
    const authorizationModelState = useAppSelector((state) => state.authorizationModel.authorizationModel);
    const currentDsl = useAppSelector((state) => state.authorizationModel.currentDsl);
    const dispatch = useAppDispatch();
    const updateStoreList = useCallback(async () => {
        const store = await getStore()
        if (store) {
            dispatch(setStoreState(store))
        }
    }, [dispatch])
    useEffect(() => {
        updateStoreList()
    }, [updateStoreList])
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
                <StoreViewModal />
                <MenubarDemo
                    data={[
                        { label: "Copy Store ID", action: () => copyToClipboard(currentStore?.id || "") },
                        { label: "Copy Last Authorization Model ID", action: () => copyToClipboard(authorizationModelState?.id || "") },
                        { label: "Copy Store Data", action: () => copyToClipboard(currentDsl) }
                    ]
                    }
                />
            </div>
        </div>
    )
}
