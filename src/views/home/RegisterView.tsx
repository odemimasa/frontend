import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/shadcn/Form";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { AuthModel } from "../../models/AuthModel";
import { Input } from "@components/shadcn/Input";
import { Button } from "@components/shadcn/Button";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useRegisterViewModel } from "../../viewmodels/home/useRegisterViewModel";

function RegisterView() {
  const { retryWithoutRefresh } = useAxiosContext();
  const authModel = new AuthModel(retryWithoutRefresh);
  const registerViewModel = useRegisterViewModel(authModel);

  return (
    <Form {...registerViewModel.form}>
      <form
        onSubmit={registerViewModel.form.handleSubmit(
          registerViewModel.register
        )}
        autoComplete="off"
        className="space-y-6"
      >
        <FormField
          control={registerViewModel.form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#6594AB]">Username</FormLabel>

              <FormControl>
                <Input
                  disabled={registerViewModel.isLoading}
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
          control={registerViewModel.form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#6594AB]">Email</FormLabel>

              <FormControl>
                <Input
                  disabled={registerViewModel.isLoading}
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
          control={registerViewModel.form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#6594AB]">Password</FormLabel>

              <FormControl>
                <div className="relative">
                  <Input
                    disabled={registerViewModel.isLoading}
                    type={
                      registerViewModel.isPasswordVisible ? "text" : "password"
                    }
                    className="border border-[#B4B4B4]"
                    {...field}
                  />

                  <button
                    onClick={registerViewModel.togglePasswordVisibility}
                    type="button"
                    className="absolute w-6 h-6 top-1/2 -translate-y-1/2 right-3"
                  >
                    {registerViewModel.isPasswordVisible ? (
                      <EyeOpenIcon />
                    ) : (
                      <EyeClosedIcon />
                    )}
                  </button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={registerViewModel.isLoading}
          type="submit"
          className="bg-[#6594AB] hover:bg-[#6594AB]/90 w-full"
        >
          {registerViewModel.isLoading ? "Loading..." : "Daftar"}
        </Button>
      </form>
    </Form>
  );
}

export { RegisterView };
