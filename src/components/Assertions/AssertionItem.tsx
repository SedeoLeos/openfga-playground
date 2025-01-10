import React from 'react'
import DeleteIcon from '../icons/Delete'
import AssertionAskIcon from '../icons/AssertionAsk';
import AssertionRun from '../icons/AssertionRun';
import { Button } from '../ui/button';
import { Assertion } from '@openfga/sdk';
import { useAppDispatch } from '@/stores/store';
import { setCurrentAssertionState } from '@/stores/slice';
const DEFAULT_ASSERTION: Assertion = {
    tuple_key: {
        user: "user:e41acffd-6d30-4467-bca6-883d678b5934",
        relation: "owner",
        object: "org:org1",
    },
    expectation: true
}
export default function AssertionItem({ assertion = DEFAULT_ASSERTION }: {

    assertion?: Assertion;
}) {
    const dispatch = useAppDispatch()
    return (
        <div className="flex gap-4 items-center justify-between text-white border border-white/30 rounded-md p-4">
            <div className="flex gap-2">
                <AssertionAskIcon />
            </div>
            <div className="flex gap-10 justify-center">
                <div className="flex flex-col gap-2 text-zinc-500 text-[11px]">
                    <span>USER</span>
                    <span>RELATION</span>
                    <span>OBJECT</span>
                    <span>ALLOWED</span>
                </div>
                <div className="flex flex-col gap-2 justify-between text-[11px]">
                    <span>{assertion.tuple_key.user}</span>
                    <span>{assertion.tuple_key.relation}</span>
                    <span>{assertion.tuple_key.object}</span>
                    <span>{assertion.expectation ? "True" : "False"}</span>
                </div>

            </div>
            <div className="flex gap-2">
                <Button className='!bg-transparent !border-none !shadow-none' onClick={() => dispatch(setCurrentAssertionState(assertion)) }>
                    <AssertionRun />
                </Button>
                <Button className='!bg-transparent !border-none !shadow-none'>
                    <DeleteIcon />
                </Button>
            </div>

        </div>
    )
}
