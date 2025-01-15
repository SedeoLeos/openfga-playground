import { useAppSelector } from '@/stores/store'
import { useState } from 'react'
import ChevronIcon from '../icons/Chevron'
import { Button } from '../ui/button'
import TupleForm from './Form'
import TupleItem from './TupleItem'


export default function Tuples() {
   
    const tuples = useAppSelector((state) => state.tupleFga.tuples)
    const [open, setOpen] = useState(false);
   
    return (
        <div className="flex flex-col gap-4 pb-5  flex-1 overflow-hidden">
            <div className="flex items-end overflow-y-scroll  no-scrollbar flex-col">
                <Button onClick={() => setOpen((prev) => !prev)} className="!bg-transparent !text-white text-sm !shadow-none">ADD TUPLE
                    <ChevronIcon />
                </Button>
                <div className='flex-1 w-full items-center'>
                    {open && <TupleForm cancel={() => setOpen(false)} />}
                </div>
            </div>
            <div className="flex flex-col gap-4 flex-1 overflow-y-scroll  no-scrollbar">
                {tuples.map((tuple, index) => (
                    <TupleItem key={index} {...tuple.key} />
                ))}

            </div>
        </div>
    )
}
