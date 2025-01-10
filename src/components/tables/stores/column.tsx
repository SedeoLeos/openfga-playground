"use client"

import { Button } from "@/components/ui/button"
import { Store } from "@openfga/sdk"
import { ColumnDef, Table } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"
import { deleteStoreAction } from "@/actions/open-fga.action"
import { useAppDispatch, useAppSelector } from "@/stores/store"
import { setStoreState } from "@/stores/slice"
// Composant séparé pour la cellule d'action
interface DeleteCellProps {
    store: Store;
    table: Table<Store>;
}

const DeleteCell = ({ store }: DeleteCellProps) => {
    const storeState = useAppSelector((state) => state.storeFga.store);
    const dispatch = useAppDispatch();

    const handleDelete = async () => {
        const currentStore = prompt(`Are you sure you want to delete this store? if yes pas complete this ${store.name}`)
        if (currentStore !== store.name) return 
        const res = await deleteStoreAction({ id: store.id });

        if (res && res.data && res.data.store) {
            const currentData = storeState;
            const updatedStores = currentData
                .filter(s => s.id !== store.id);

            dispatch(setStoreState(updatedStores));
        }
    }

    return (
        <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    );
}

export const StoreColumns: ColumnDef<Store>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "created_at",
        header: "Created At",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row, table }) => {
            return <DeleteCell store={row.original} table={table} />;
        },
    },
]
