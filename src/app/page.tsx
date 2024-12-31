'use client'
import MonacoEditor from "@/components/MonacoEditor";
import NavHeader from "@/components/NavHeader";
import { Button } from "@/components/ui/button";
import { getOrganization, loginVerifyCredential, loginVerifyOtp, refreshAccessToken } from "./_action/proxy.action";


export default function Home() {

  return (
    <div className="flex flex-col h-screen w-full font-[family-name:var(--font-geist-sans)]">
      <NavHeader />
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col h-full min-w-[450px]">
          <MonacoEditor />
        </div>
        <div className="flex-1 flex flex-col h-full min-w-[450px]">
          <Button onClick={async () => await loginVerifyCredential("sample@sample.com")}>
            Login
          </Button>
          <Button onClick={async () => {
            const otpCode = prompt('Saisir le code');
            if (otpCode) {
              const data = await loginVerifyOtp("sample@sample.com", otpCode);
              console.log(" /*",data);
            }
          }}>
            Verify
          </Button>
          <Button onClick={async () => await refreshAccessToken()}>
            Refresh
          </Button>
          <Button onClick={async () => await getOrganization()}>
            me
          </Button>

        </div>


      </div>
    </div>
  );
}
