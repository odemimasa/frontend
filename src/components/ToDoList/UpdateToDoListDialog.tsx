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
import { useStore } from "@hooks/useStore";
import { useToast } from "@hooks/shadcn/useToast";
import { Button } from "@components/shadcn/Button";
import { Textarea } from "@components/shadcn/Textarea";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import axiosRetry from "axios-retry";
import type { AxiosError } from "axios";

interface UpdateToDoListDialogProps {
  id: string;
  name: string;
  description: string;
  checked: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama ibadah tidak boleh kosong." }),
  description: z.string(),
});

function UpdateToDoListDialog({
  id,
  name,
  description,
  checked,
  open,
  setOpen,
}: UpdateToDoListDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const setToDoLists = useStore((state) => state.setToDoLists);
  const { toast } = useToast();
  const { retryWithRefresh } = useAxiosContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name, description },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const res = await retryWithRefresh.put(
        `/tasks/${id}`,
        {
          name: values.name,
          description: values.description,
          checked,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 200) {
        toast({
          description: "Berhasil mengubah ibadah.",
          variant: "default",
        });

        setToDoLists((toDoLists) => {
          const idx = toDoLists!.findIndex((item) => item.id === id);
          toDoLists![idx].name = values.name;
          toDoLists![idx].description = values.description;
          return toDoLists;
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
          description: "Gagal mengubah ibadah.",
          variant: "destructive",
        });
      }

      console.error(new Error("failed to update to-do list", { cause: error }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm [&_svg]:size-5">
        <DialogHeader>
          <DialogTitle className="text-[#363636] font-bold text-lg">
            Ubah Ibadah
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
              {isLoading ? "Loading..." : "Ubah"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { UpdateToDoListDialog };
