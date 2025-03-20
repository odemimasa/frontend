import { Button } from "@components/shadcn/Button";
import { PlusIcon } from "@radix-ui/react-icons";
import { TaskSkeletonView } from "./TaskSkeletonView";
import { DemiMasaHeaderView } from "../DemiMasaHeaderView";

function TaskPageSkeletonView() {
  return (
    <>
      <DemiMasaHeaderView />

      <div className="flex justify-between items-center mx-6 mt-6">
        <h1 className="text-[#363636] font-bold text-xl">Daftar Ibadah</h1>

        <Button
          disabled
          type="button"
          className="bg-[#6594AB] hover:bg-[#6594AB]/90 text-white font-semibold [&_svg]:size-5"
        >
          Buat
          <PlusIcon />
        </Button>
      </div>

      <TaskSkeletonView />
    </>
  );
}

export { TaskPageSkeletonView };
