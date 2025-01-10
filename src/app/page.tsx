'use client'
import LeftComponent from "@/components/LeftComponent";
import NavHeader from "@/components/NavHeader";
import { RightComponent } from "@/components/RightComponent";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ReduxProvider from "@/stores/redux-provider";




export default function Home() {

  return (
    <ReduxProvider>
      <div className="flex flex-col h-screen w-full font-[family-name:var(--font-geist-sans)]">
        <NavHeader />
        <div className="flex-1 flex overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="min-w-[450px] w-[550px]" >
              <LeftComponent />
            </ResizablePanel>
            <ResizableHandle withHandle className="min-w-[20px] !bg-transparent border-l border-r border-l-white/20 border-r-white/20" />
            <ResizablePanel className="min-w-[450px] flex" defaultSize={65}>
              <RightComponent />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </ReduxProvider>
  );
}
