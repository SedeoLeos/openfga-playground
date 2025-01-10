import React, { useCallback, useEffect } from 'react'
import MonacoEditor from './MonacoEditor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import Tuples from './Tuples'
import { useAppDispatch, useAppSelector } from '@/stores/store'
import AssertionContainer from './Assertions'
import { getAssertions, getTuples } from '@/actions/open-fga.action'
import { setAssertionState, setTupleState } from '@/stores/slice'


export default function LeftComponent() {
    const tuples = useAppSelector((state) => state.tupleFga.tuples)
    const assertions = useAppSelector((state) => state.assertionFga.assertions)
    const currentStore = useAppSelector((state) => state.storeFga.currentStore)
    const authorizationModel = useAppSelector((state) => state.authorizationModel.authorizationModel)

    const dispatch = useAppDispatch();

    const updateAssertions = useCallback(async () => {
        if (currentStore && authorizationModel) {
            const assertions = await getAssertions(currentStore.id, authorizationModel.id)
            if (assertions) dispatch(setAssertionState(assertions))
        }
    }, [currentStore, authorizationModel, dispatch])
    
    
    
    const updateTuples = useCallback(async () => {
        if (currentStore) {
            const tuples = await getTuples(currentStore.id)
            dispatch(setTupleState(tuples))
        }
    }, [currentStore, dispatch])
    useEffect(() => {
        updateAssertions()
        updateTuples()
    }, [currentStore, updateAssertions,updateTuples]);
    
    return (
        <div className="flex-1 flex flex-col h-full min-w-[450px] overflow-hidden">
            <MonacoEditor />
            <div className="flex-1 px-5 overflow-hidden flex">
                <Tabs defaultValue="tuples" className="overflow-hidden flex-1 flex flex-col">
                    <div className="border-b-[0.5px] border-b-white/30 !p-0">
                        <TabsList className="bg-transparent text-white  rounded-none !p-0">
                            <TabsTrigger value="tuples" className="!bg-transparent !shadow-none  h-full data-[state=active]:text-indigo-500 data-[state=active]:border-b data-[state=active]:border-b-indigo-500 rounded-none">Tuples {`(${tuples.length})`}</TabsTrigger>
                            <TabsTrigger value="assertions" className="!bg-transparent !shadow-none  h-full  data-[state=active]:text-indigo-500 data-[state=active]:border-b data-[state=active]:border-b-indigo-500 rounded-none" >Assertions {`(${assertions.length})`}</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="tuples" className="max-h-[calc(100%-40px)]  flex overflow-hidden">
                        <Tuples />
                    </TabsContent>
                    <TabsContent value="assertions" className="max-h-[calc(100%-100px)] flex flex-col gap-4  overflow-hidden">
                        <AssertionContainer/>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    )
}
