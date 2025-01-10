import React from 'react'
import InfoIcon from '../icons/Info'
import DeleteIcon from '../icons/Delete'
const DEFAULT_TUPLE = {
    user: "user:e41acffd-6d30-4467-bca6-883d678b5934",
    relation: "owner",
    object: "org:org1"
}
export default function TupleItem({ user = DEFAULT_TUPLE.user, relation = DEFAULT_TUPLE.relation, object = DEFAULT_TUPLE.object }: {
    user?: string;
    relation?: string;
    object?: string;
}) {
    return (
        <div className="flex gap-4 items-center justify-between text-white border border-white/30 rounded-md p-4">
            <div className="flex gap-10 justify-center">
                <div className="flex flex-col gap-2 text-zinc-500 text-[11px]">
                    <span>USER</span>
                    <span>RELATION</span>
                    <span>OBJECT</span>
                </div>
                <div className="flex flex-col gap-2 justify-between text-[11px]">
                    <span>{user}</span>
                    <span>{relation}</span>
                    <span>{object}</span>
                </div>

            </div>
            <div className="flex gap-2">
                <InfoIcon />
                <DeleteIcon />
            </div>

        </div>
    )
}
