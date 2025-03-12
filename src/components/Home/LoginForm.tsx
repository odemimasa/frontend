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
import { useToast } from "@hooks/shadcn/useToast";
import { useStore, type User } from "@hooks/useStore";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthContext } from "../../contexts/AuthProvider";

const formSchema = z.object({
  email: z.string().email({ message: "Email invalid" }),
  password: z.string().min(8, { message: "Harus memiliki minimal 8 karakter" }),
});

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const setUser = useStore((state) => state.setUser);
  const { toast } = useToast();
  const { retryWithoutRefresh } = useAuthContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      }>("/auth/login", {
        email: values.email,
        password: values.password,
      });

      if (res.status === 200) {
        toast({
          description: "Login berhasil.",
          variant: "default",
        });
        setUser(res.data.user);
      } else if (res.status === 404) {
        toast({
          description:
            "Akun tidak ditemukan. Silakan melakukan registrasi terlebih dahulu.",
          variant: "destructive",
        });
      } else {
        throw new Error(`unknown response status ${res.status}`);
      }
    } catch (error) {
      console.error(new Error("failed to login", { cause: error }));
      toast({
        description: "Login gagal. Silakan coba kembali.",
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#BF8E50]">Email</FormLabel>

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
              <FormLabel className="text-[#BF8E50]">Password</FormLabel>

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
          className="bg-[#BF8E50] hover:bg-[#BF8E50]/90 w-full"
        >
          {isLoading ? "Loading..." : "Masuk"}
        </Button>
      </form>
    </Form>
  );
}

export { LoginForm };
