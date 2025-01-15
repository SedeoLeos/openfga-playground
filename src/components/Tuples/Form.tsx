import { createTuple } from '@/actions/open-fga.action'
import { addTuple } from '@/stores/slice'
import { useAppDispatch, useAppSelector } from '@/stores/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tuple } from '@openfga/sdk'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

const formSchema = z.object({
    user: z.string().min(2, {
        message: "User must be at least 2 characters.",
    }),
    relation: z.string().min(2, {
        message: "Relation must be at least 2 characters.",
    }),
    object: z.string().min(2, {
        message: "Object must be at least 2 characters.",
    }),
})
export type TupleFormProps = {
    cancel: () => void
}
export default function TupleForm({ cancel }: TupleFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            user: "",
            relation: "",
            object: "",
        },
    })
    const currentStore = useAppSelector((state) => state.storeFga.currentStore);
    const dispatch = useAppDispatch();
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        if (!currentStore) return
        console.log(values, currentStore)
        const res = await createTuple({ id: currentStore?.id, body: values })
        if (res && res.data && res.data.data.status == 200) {
            const tuple: Tuple = {
                key: {
                    user: values.user,
                    relation: values.relation,
                    object: values.object,
                },
                timestamp: new Date().toISOString(),
            }
            dispatch(addTuple(tuple))
            cancel()

        }
    }

    return (
        <div className='w-full p-5 border border-white/30 text-white'>

            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)}>


                    <FormField
                        control={form.control}
                        name="user"
                        render={({ field }) => (
                            <FormItem className='flex items-center gap-10 justify-center'>
                                <FormLabel className='min-w-[100px]'>User</FormLabel>
                                <FormControl className='h-10'>
                                    <Input  {...field} className='rounded-none bg-[rgb(35,_35,_35)] text-[rgb(160,160,160)] border-white/30' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="relation"
                        render={({ field }) => (
                            <FormItem className='flex items-center  gap-10 justify-center'>
                                <FormLabel className='min-w-[100px]'>Relation</FormLabel>
                                <FormControl className='h-10'>
                                    <Input  {...field} className='rounded-none bg-[rgb(35,_35,_35)] text-[rgb(160,160,160)] border-white/30' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="object"
                        render={({ field }) => (
                            <FormItem className='flex items-center gap-10 justify-center'>
                                <FormLabel className='min-w-[100px]'>Object</FormLabel>
                                <FormControl className='h-10'>
                                    <Input  {...field} className='rounded-none bg-[rgb(35,_35,_35)] text-[rgb(160,160,160)] border-white/30' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex gap-4 justify-end mt-5'>
                        <Button type='button' className='px-10 !bg-gray-500' onClick={cancel}>CANCEL</Button>
                        <Button className='!bg-indigo-800 px-10'>SAVE</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
