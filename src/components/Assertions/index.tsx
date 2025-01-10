import React from 'react'
import AssertToolList from './AssertToolContainer'
import AssertionItem from './AssertionItem'
import {  useAppSelector } from '@/stores/store'


export default function AssertionContainer() {

    const assertions = useAppSelector((state) => state.assertionFga.assertions)
   
    return (
        <>
            <AssertToolList />
            <div className='flex gap-4 flex-col overflow-y-scroll  no-scrollbar flex-1'>
                {assertions.map((item, index) => <AssertionItem   assertion={item} key={index} />)}
            </div>
        </>
    )
}
