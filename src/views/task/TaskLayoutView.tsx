import { Button } from "@components/shadcn/Button";
import { PlusIcon } from "@radix-ui/react-icons";
import { CreateTaskView } from "./CreateTaskView";
import { useState } from "react";
import { Outlet } from "react-router";

function TaskLayoutView() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mx-6 mt-6">
        <h1 className="text-[#363636] font-bold text-xl">Daftar Ibadah</h1>

        <Button
          onClick={() => setIsOpen(true)}
          type="button"
          className="bg-[#6594AB] hover:bg-[#6594AB]/90 text-white font-semibold [&_svg]:size-5"
        >
          Buat
          <PlusIcon />
        </Button>

        <CreateTaskView isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      <Outlet />
    </>
  );
}

export { TaskLayoutView };
