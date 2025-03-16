import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/shadcn/Tabs";
import { useState } from "react";
import { LoginView } from "./LoginView";

function AuthView() {
  const [selectedView, setSelectedView] = useState<"login" | "daftar">("login");

  return (
    <div className="bg-[url('https://ec3q29jlfx8dke21.public.blob.vercel-storage.com/sunset-TfWM2wgOqUOYBYYM8D6FSw56IY0zCs.jpg')] bg-cover bg-center mt-32 px-6 py-16">
      <Tabs
        defaultValue={selectedView}
        className="bg-white/90 rounded-2xl py-8 px-5"
      >
        <TabsList
          className={`${selectedView === "login" ? "border-[#BF8E50]" : "border-[#6594AB]"} bg-transparent block w-fit mx-auto border-[3px] h-fit p-1.5 rounded-lg`}
        >
          <TabsTrigger
            onClick={() => setSelectedView("login")}
            value="login"
            className="bg-transparent data-[state=active]:bg-[#BF8E50] text-black data-[state=active]:text-white"
          >
            Login
          </TabsTrigger>

          <TabsTrigger
            onClick={() => setSelectedView("daftar")}
            value="daftar"
            className="bg-transparent data-[state=active]:bg-[#6594AB] text-black data-[state=active]:text-white"
          >
            Daftar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LoginView />
        </TabsContent>

        <TabsContent value="daftar"></TabsContent>
      </Tabs>
    </div>
  );
}

export { AuthView };
