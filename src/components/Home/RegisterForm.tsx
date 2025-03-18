import { Button } from "@components/shadcn/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/shadcn/Form";
import { Input } from "@components/shadcn/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useToast } from "@hooks/shadcn/useToast";
import { useStore, type User } from "@hooks/useStore";
import { tokenStorage } from "@utils/token";

const formSchema = z.object({
  username: z.string().min(2, { message: "Harus memiliki minimal 2 karakter" }),
  email: z.string().email({ message: "Email invalid" }),
  password: z.string().min(8, { message: "Harus memiliki minimal 8 karakter" }),
});

function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const setUser = useStore((state) => state.setUser);
  const { toast } = useToast();
  const { retryWithoutRefresh } = useAxiosContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const res = await retryWithoutRefresh.post<{
        user: User;
        access_token: string;
        refresh_token: string;
      }>("/auth/register", {
        username: values.username,
        email: values.email,
        password: values.password,
      });

      if (res.status === 201) {
        toast({
          description: "Registrasi berhasil.",
          variant: "default",
        });

        tokenStorage.setAccessToken(res.data.access_token);
        tokenStorage.setRefreshToken(res.data.refresh_token);
        setUser(res.data.user);
      } else if (res.status === 409) {
        toast({
          description: "Email telah terdaftar.",
          variant: "destructive",
        });
      } else {
        throw new Error(`unknown response status ${res.status}`);
      }
    } catch (error) {
      console.error(new Error("failed to register", { cause: error }));
      toast({
        description: "Registrasi gagal. Silakan coba kembali.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#6594AB]">Username</FormLabel>

              <FormControl>
                <Input
                  disabled={isLoading}
                  type="text"
                  placeholder="John Doe"
                  className="border border-[#B4B4B4]"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#6594AB]">Email</FormLabel>

              <FormControl>
                <Input
                  disabled={isLoading}
                  type="email"
                  placeholder="example@gmail.com"
                  className="border border-[#B4B4B4]"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#6594AB]">Password</FormLabel>

              <FormControl>
                <div className="relative">
                  <Input
                    disabled={isLoading}
                    type={isPasswordVisible ? "text" : "password"}
                    className="border border-[#B4B4B4]"
                    {...field}
                  />

                  <button
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    type="button"
                    className="absolute w-6 h-6 top-1/2 -translate-y-1/2 right-3"
                  >
                    {isPasswordVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={isLoading}
          type="submit"
          className="bg-[#6594AB] hover:bg-[#6594AB]/90 w-full"
        >
          {isLoading ? "Loading..." : "Daftar"}
        </Button>
      </form>
    </Form>
  );
}

export { RegisterForm };
