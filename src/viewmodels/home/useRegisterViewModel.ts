import { useState } from "react";
import type { AuthModel } from "../../models/AuthModel";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { tokenStorage } from "@utils/token";

const formSchema = z.object({
  username: z.string().min(2, { message: "Harus memiliki minimal 2 karakter" }),
  email: z.string().email({ message: "Email invalid" }),
  password: z.string().min(8, { message: "Harus memiliki minimal 8 karakter" }),
});

function useRegisterViewModel(authModel: AuthModel) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { toast } = useToast();
  const { handleAxiosError } = useAxiosContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const register = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const res = await authModel.register({
        username: values.username,
        email: values.email,
        password: values.password,
      });

      if (res.status === 201) {
        toast({ description: "Registrasi berhasil.", variant: "default" });
        tokenStorage.setAccessToken(res.data.access_token);
        tokenStorage.setRefreshToken(res.data.refresh_token);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (res.status === 400) {
        throw new Error("invalid request body");
      } else if (res.status === 409) {
        toast({
          description: "Email telah terdaftar.",
          variant: "destructive",
        });
      }
    } catch (error) {
      handleAxiosError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isPasswordVisible,
    form,
    register,
    setIsPasswordVisible,
    togglePasswordVisibility,
  };
}

export { useRegisterViewModel };
