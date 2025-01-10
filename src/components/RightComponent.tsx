import {
    CustomAccordion,
    CustomAccordionContent,
    CustomAccordionItem,
    CustomAccordionTrigger,
} from "@/components/ui/custom-accordion";
import VisNetWorkGraph from "./VisNetWorkGraph";
import VisTree from "./VisTree";
import {  useMemo } from "react";
import { useAppSelector } from "@/stores/store";


export function RightComponent() {
  
    const currentAssertion = useAppSelector((state) => state.assertionFga.currentAssertion);
    const value = useMemo(()=>{
        if(currentAssertion){
            return "item-2"
        }else{
            return "item-1"
        }
    },[currentAssertion])
    return (
        <CustomAccordion defaultValue="item-1" className="flex flex-col min-w-[450px] flex-1 " value={value}>
            <CustomAccordionItem value="item-1" className="flex flex-col data-[state=open]:flex-grow">

                <CustomAccordionTrigger value="item-1">
                    <div className="flex items-center !bg-transparent !text-white text-sm !shadow-none">
                        Types Previewer
                    </div>
                </CustomAccordionTrigger>
                <CustomAccordionContent value="item-1" >
                    <VisNetWorkGraph />
                </CustomAccordionContent>
            </CustomAccordionItem>
            <CustomAccordionItem value="item-2" className="flex flex-col data-[state=open]:flex-grow">
                <CustomAccordionTrigger value="item-2">
                    <div className="!bg-transparent !text-white text-sm !shadow-none">
                        Tuple queries
                    </div>
                </CustomAccordionTrigger>
                <CustomAccordionContent value="item-2" >
                    <VisTree />
                </CustomAccordionContent>
            </CustomAccordionItem>
        </CustomAccordion>
    );
}
