import { AlertDialogHeader } from "@components/shadcn/AlertDialog";
import { Button } from "@components/shadcn/Button";
import { Dialog, DialogContent, DialogTitle } from "@components/shadcn/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/shadcn/Form";
import { Input } from "@components/shadcn/Input";
import { Textarea } from "@components/shadcn/Textarea";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { TaskModel } from "../../models/TaskModel";
import { useCreateTaskViewModel } from "../../viewmodels/task/useCreateTaskViewModel";
import type { z } from "zod";

interface CreateTaskViewProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function CreateTaskView({ isOpen, setIsOpen }: CreateTaskViewProps) {
  const { retryWithRefresh } = useAxiosContext();
  const taskModel = useMemo((): TaskModel => {
    return new TaskModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const createTaskViewModel = useCreateTaskViewModel(taskModel);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm [&_svg]:size-5">
        <AlertDialogHeader>
          <DialogTitle className="text-[#363636] font-bold text-lg">
            Buat Ibadah
          </DialogTitle>
        </AlertDialogHeader>

        <Form {...createTaskViewModel.form}>
          <form
            onSubmit={createTaskViewModel.form.handleSubmit(
              (values: z.infer<typeof createTaskViewModel.formSchema>) =>
                createTaskViewModel.createTask(values, setIsOpen)
            )}
            autoComplete="off"
            className="space-y-6"
          >
            <FormField
              control={createTaskViewModel.form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-bold">
                    Nama Ibadah
                  </FormLabel>

                  <FormControl>
                    <Input
                      disabled={createTaskViewModel.isLoading}
                      type="text"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createTaskViewModel.form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-bold">
                    Deskripsi Ibadah
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      disabled={createTaskViewModel.isLoading}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={createTaskViewModel.isLoading}
              type="submit"
              className="bg-[#6594AB] hover:bg-[#6594AB]/90 font-semibold w-full"
            >
              {createTaskViewModel.isLoading ? "Loading..." : "Buat"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { CreateTaskView };
