'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { createStoreAction } from '@/actions/open-fga.action'
import { useAppDispatch } from '@/stores/store'
import { appendStoreState } from '@/stores/slice'
import { StoreSchema } from '@/lib/schemas/store.schema'


export default function StoreForm() {
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const form = useForm<z.infer<typeof StoreSchema.createStoreSchema>>({
        resolver: zodResolver(StoreSchema.createStoreSchema),
        defaultValues: {
            name: "",
        },
    })

    async function onSubmit(storeFormData: z.infer<typeof StoreSchema.createStoreSchema>) {
        const res = await createStoreAction(storeFormData);
        if (res && res.validationErrors) {
            console.log(res.validationErrors);
            return;
        }
        if (res && res.data && res.data.store) {
            dispatch(appendStoreState(res.data.store))
            form.reset();
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='!bg-[#635dff]' type='button' onClick={() => setOpen(true)}>NEW STORE</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#282828] !border-none p-5 text-white">
                <DialogHeader className='flex justify-center items-center'>
                    <DialogTitle>Create store</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="flex justify-center items-center p-5">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input
                                                placeholder="Store name (only letters, numbers and '-')"
                                                className="w-full h-12 !outline-none p-2 bg-[#1f2123] border-[#42464d] text-[#8c929c]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className='!flex !justify-center !items-center'>
                            <Button type="button" onClick={() => {
                                form.reset();
                                setOpen(false);
                            }}>CANCEL</Button>
                            <Button type="submit" className='!bg-[#635dff]'>CREATE</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
