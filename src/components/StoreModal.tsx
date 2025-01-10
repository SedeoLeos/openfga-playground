'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import {  useAppSelector } from '@/stores/store'
import { StoreDataTable } from './tables/stores/data-table'
import { StoreColumns } from './tables/stores/column'

export default function StoreViewModal() {
    const storeFgaState = useAppSelector((state) => state.storeFga.store);
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='' type='button' onClick={() => setOpen(true)}>Views STORE</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[755px] bg-[#282828] !border-none p-5 text-white max-h-[600px] flex flex-col">
                <DialogHeader className='flex justify-center items-center'>
                    <DialogTitle>List store</DialogTitle>
                </DialogHeader>
                <StoreDataTable data={storeFgaState} columns={StoreColumns}/>
            </DialogContent>
        </Dialog>
    )
}
