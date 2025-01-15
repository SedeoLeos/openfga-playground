import { deleteTuple } from '@/actions/open-fga.action';
import { removeTuple } from '@/stores/slice';
import { useAppDispatch, useAppSelector } from '@/stores/store';
import { Tuple } from '@openfga/sdk';
import DeleteIcon from '../icons/Delete';
import InfoIcon from '../icons/Info';
import { Button } from '../ui/button';
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
    const currentStore = useAppSelector((state) => state.storeFga.currentStore);
    const dispatch = useAppDispatch();
    const handleDelete = async () => {
        const yes = confirm("Are you sure you want to delete this tuple?")
        if (!yes || !currentStore) return;
        const res = await deleteTuple({ id: currentStore.id, body: { user, relation, object } });
        if (res && res.data && res.data.data.status == 200) {
            const tuple: Tuple = {
                key: {
                    user,
                    relation,
                    object,
                },
                timestamp: new Date().toISOString(),
            }

            dispatch(removeTuple(tuple));
        }
    }
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
            <div className="flex gap-2 items-center">
                <InfoIcon />
                <Button variant="ghost" size="icon" className='!bg-transparent !text-white text-sm !shadow-none' onClick={handleDelete}>
                    <DeleteIcon />
                </Button>
            </div>

        </div>
    )
}
