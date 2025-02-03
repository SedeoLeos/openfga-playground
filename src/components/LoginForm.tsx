'use client'
import { zodResolver } from '@hookform/resolvers/zod'

import { LoginAction } from '@/actions/auth.action'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

const formSchema = z.object({
    email: z.string().min(2, {
        message: "User must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Relation must be at least 2 characters.",
    }),
})

export default function LoginForm() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // This will be type-safe and validated.
        console.log(values)
        const res =await LoginAction(values)
        console.log(res)
        if(res?.data?.token) {
            router.push('/playground')
        }
    }

    return (
        <div className='justify-center items-center flex h-screen' >
            <div className='flex flex-col justify-center items-center gap-5  max-w-[400px] w-full rounded-lg  px-10 py-10 h-[500px] text-white bg-[rgb(40,40,_40)]  '>

                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-10'>

                        <div className='flex flex-col gap-4 ' >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className='min-w-[100px]'>Email *</FormLabel>
                                        <FormControl className='h-12'>
                                            <Input  {...field} className='rounded-lg bg-[rgb(35,_35,_35)] text-[rgb(160,160,160)] border-white/30 focus:border-transparent focus:ring-2 focus:ring-indigo-500' placeholder='email@email.com' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className='min-w-[100px]'>Password *</FormLabel>
                                        <FormControl className='h-12'>
                                            <Input  {...field} className='rounded-lg bg-[rgb(35,_35,_35)] text-[rgb(160,160,160)] border-white/30 focus:border-transparent' placeholder='********' type='password' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <div className='flex gap-4 justify-end mt-5 w-full'>
                            <Button className='!bg-indigo-800 px-10 p-6 w-full'>Login</Button>
                        </div>
                    </form>
                </Form>
            </div>

        </div>
    )
}
