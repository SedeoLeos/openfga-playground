import React from 'react'
import ChevronIcon from '../icons/Chevron'
import { Button } from '../ui/button'
import TupleItem from './TupleItem'
import { useAppSelector } from '@/stores/store'


export default function Tuples() {
   
    const tuples = useAppSelector((state) => state.tupleFga.tuples)
   
    return (
        <div className="flex flex-col gap-4 pb-5  flex-1 overflow-hidden">
            <div className="flex justify-end">
                <Button className="!bg-transparent !text-white text-sm !shadow-none">ADD TUPLE
                    <ChevronIcon />
                </Button>
            </div>
            <div className="flex flex-col gap-4 flex-1 overflow-y-scroll  no-scrollbar">
                {tuples.map((tuple, index) => (
                    <TupleItem key={index} {...tuple.key} />
                ))}

            </div>
        </div>
    )
}
