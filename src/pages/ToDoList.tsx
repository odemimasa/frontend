import { Button } from "@components/shadcn/Button";
import { Skeleton } from "@components/shadcn/Skeleton";
import { useToast } from "@hooks/shadcn/useToast";
import { useStore, type ToDoList } from "@hooks/useStore";
import { PlusIcon } from "@radix-ui/react-icons";
import { lazy, useEffect, useState } from "react";
import { useAxiosContext } from "../contexts/AxiosProvider";
import axiosRetry from "axios-retry";
import type { AxiosError } from "axios";

const CreateToDoListDialog = lazy(() =>
  import("@components/ToDoList/CreateToDoListDialog").then(
    ({ CreateToDoListDialog }) => ({
      default: CreateToDoListDialog,
    })
  )
);

const ToDoListItem = lazy(() =>
  import("@components/ToDoList/ToDoListItem").then(({ ToDoListItem }) => ({
    default: ToDoListItem,
  }))
);

export default function ToDoList() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toDoLists = useStore((state) => state.toDoLists);
  const setToDoLists = useStore((state) => state.setToDoLists);

  const { retryWithRefresh } = useAxiosContext();
  const { toast } = useToast();

  useEffect(() => {
    if (toDoLists !== undefined) return;
    (async () => {
      setIsLoading(true);
      try {
        const res = await retryWithRefresh.get<ToDoList[]>("/tasks");
        if (res.status === 200) {
          setToDoLists(res.data);
        }
      } catch (error) {
        const status = (error as AxiosError).response?.status;
        if (
          axiosRetry.isNetworkError(error as AxiosError) ||
          (status || 0) >= 500
        ) {
          toast({
            description: "Gagal menampilkan daftar ibadah.",
            variant: "destructive",
          });
        }

        console.error(new Error("failed to get to-do lists", { cause: error }));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [setToDoLists, retryWithRefresh, toast, toDoLists]);

  if (isLoading) {
    return (
      <>
        <div className="flex justify-between items-center mx-6 mt-6">
          <h1 className="text-[#363636] font-bold text-xl">Daftar Ibadah</h1>
          <Button
            onClick={() => setOpen(true)}
            type="button"
            className="bg-[#6594AB] hover:bg-[#6594AB]/90 text-white font-semibold [&_svg]:size-5"
          >
            Buat
            <PlusIcon />
          </Button>
          {open ? (
            <CreateToDoListDialog open={open} setOpen={setOpen} />
          ) : (
            <></>
          )}
        </div>

        <div className="animate-pulse border border-[#C2C2C2] rounded-lg flex flex-col space-y-3 mx-6 mt-6 p-5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mx-6 mt-6">
        <h1 className="text-[#363636] font-bold text-xl">Daftar Ibadah</h1>
        <Button
          onClick={() => setOpen(true)}
          type="button"
          className="bg-[#6594AB] hover:bg-[#6594AB]/90 text-white font-semibold [&_svg]:size-5"
        >
          Buat
          <PlusIcon />
        </Button>
        {open ? <CreateToDoListDialog open={open} setOpen={setOpen} /> : <></>}
      </div>

      {toDoLists !== undefined && toDoLists.length !== 0 ? (
        <div className="flex flex-col gap-4 mt-6 mx-6">
          {toDoLists.map((item) => (
            <ToDoListItem
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              checked={item.checked}
            />
          ))}
        </div>
      ) : (
        <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6 mt-6">
          Belum ada daftar ibadah
        </p>
      )}
    </>
  );
}
