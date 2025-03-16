import { useState, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/shadcn/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/shadcn/Form";
import { Input } from "@components/shadcn/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore, type ToDoList } from "@hooks/useStore";
import { useToast } from "@hooks/shadcn/useToast";
import { Button } from "@components/shadcn/Button";
import { Textarea } from "@components/shadcn/Textarea";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import axiosRetry from "axios-retry";
import type { AxiosError } from "axios";

interface CreateToDoListDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama ibadah tidak boleh kosong." }),
  description: z.string(),
});

function CreateToDoListDialog({ open, setOpen }: CreateToDoListDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const setToDoLists = useStore((state) => state.setToDoLists);
  const { toast } = useToast();
  const { retryWithRefresh } = useAxiosContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const res = await retryWithRefresh.post<ToDoList>(
        "/tasks",
        {
          name: values.name,
          description: values.description,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 201) {
        toast({
          description: "Berhasil membuat ibadah.",
          variant: "default",
        });

        setToDoLists((toDoLists) => {
          if (toDoLists === undefined) {
            return new Array<ToDoList>(res.data);
          } else {
            return [...toDoLists, res.data];
          }
        });
        setOpen(false);
      }
    } catch (error) {
      const status = (error as AxiosError).response?.status;
      if (
        axiosRetry.isNetworkError(error as AxiosError) ||
        (status || 0) >= 500
      ) {
        toast({
          description: "Gagal membuat ibadah.",
          variant: "destructive",
        });
      }

      console.error(new Error("failed to create to-do list", { cause: error }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm [&_svg]:size-5">
        <DialogHeader>
          <DialogTitle className="text-[#363636] font-bold text-lg">
            Buat Ibadah
          </DialogTitle>
        </DialogHeader>

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
                    <Input disabled={isLoading} type="text" {...field} />
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
                    <Textarea disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isLoading}
              type="submit"
              className="bg-[#6594AB] hover:bg-[#6594AB]/90 font-semibold w-full"
            >
              {isLoading ? "Loading..." : "Buat"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { CreateToDoListDialog };
