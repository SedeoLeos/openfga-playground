'use client'
import NavHeader from "@/components/NavHeader";



export default function Home() {

    return (
        <div className="flex flex-col h-screen w-full font-[family-name:var(--font-geist-sans)]">
            <NavHeader />
            <div className="text-white p-10">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid mollitia iure dolorum ut vitae sapiente, debitis assumenda incidunt, perferendis est officiis ratione praesentium dignissimos suscipit autem, velit adipisci atque voluptates!
            </div>
        </div>
    );
}
