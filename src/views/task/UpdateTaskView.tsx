import { useMemo, type Dispatch, type SetStateAction } from "react";
import { TaskModel } from "../../models/TaskModel";
import { Dialog, DialogContent, DialogTitle } from "@components/shadcn/Dialog";
import { AlertDialogHeader } from "@components/shadcn/AlertDialog";
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
import { Button } from "@components/shadcn/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useUpdateTaskViewModel } from "../../viewmodels/task/useUpdateTaskViewModel";
import type { TaskResponse, UpdateTaskRequest } from "../../dtos/TaskDTO";

interface UpdateTaskViewProps {
  task: TaskResponse;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Tidak boleh kosong." }),
  description: z.string().min(1, { message: "Tidak boleh kosong." }),
});

function UpdateTaskView({ task, isOpen, setIsOpen }: UpdateTaskViewProps) {
  const { retryWithRefresh } = useAxiosContext();
  const taskModel = useMemo((): TaskModel => {
    return new TaskModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const updateTaskViewModel = useUpdateTaskViewModel(taskModel);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: task.name, description: task.description },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const updateTaskRequest: UpdateTaskRequest = {};
    if (task.name !== values.name) {
      updateTaskRequest.name = values.name;
    }

    if (task.description !== values.description) {
      updateTaskRequest.description = values.description;
    }

    updateTaskViewModel.updateTask(task.id, updateTaskRequest, setIsOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm [&_svg]:size-5">
        <AlertDialogHeader>
          <DialogTitle className="text-[#363636] font-bold text-lg">
            Ubah Ibadah
          </DialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            autoComplete="off"
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-bold">
                    Nama Ibadah
                  </FormLabel>

                  <FormControl>
                    <Input
                      disabled={updateTaskViewModel.isLoading}
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-bold">
                    Deskripsi Ibadah
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      disabled={updateTaskViewModel.isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={
                updateTaskViewModel.isLoading ||
                (form.getValues().name === task.name &&
                  form.getValues().description === task.description)
              }
              type="submit"
              className="bg-[#6594AB] hover:bg-[#6594AB]/90 font-semibold w-full"
            >
              {updateTaskViewModel.isLoading ? "Loading..." : "Ubah"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { UpdateTaskView };
