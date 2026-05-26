import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import LeftComponent from '@/components/LeftComponent'
import NavHeader from '@/components/layout/NavHeader'
import { RightComponent } from '@/components/RightComponent'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('playground')
  return { title: t('title') }
}

export default function PlaygroundPage() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <NavHeader />
      {/* Desktop: resizable panels — Mobile: stacked tabs */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop layout */}
        <div className="hidden flex-1 overflow-hidden md:flex">
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={38} minSize={30}>
              <LeftComponent />
            </ResizablePanel>
            <ResizableHandle
              withHandle
              className="!bg-transparent border-x border-x-border/40 min-w-[1px]"
            />
            <ResizablePanel defaultSize={62} minSize={30}>
              <RightComponent />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        {/* Mobile layout */}
        <div className="flex flex-1 flex-col overflow-hidden md:hidden">
          <LeftComponent />
        </div>
      </div>
    </div>
  )
}
