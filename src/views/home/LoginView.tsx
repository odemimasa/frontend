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
import { useLoginViewModel } from "../../viewmodels/home/useLoginViewModel";
import { Input } from "@components/shadcn/Input";
import { Button } from "@components/shadcn/Button";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

function LoginView() {
  const { retryWithoutRefresh } = useAxiosContext();
  const authModel = new AuthModel(retryWithoutRefresh);
  const loginViewModel = useLoginViewModel(authModel);

  return (
    <Form {...loginViewModel.form}>
      <form
        onSubmit={loginViewModel.form.handleSubmit(loginViewModel.login)}
        autoComplete="off"
        className="space-y-6"
      >
        <FormField
          control={loginViewModel.form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#BF8E50]">Email</FormLabel>

              <FormControl>
                <Input
                  disabled={loginViewModel.isLoading}
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
          control={loginViewModel.form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#BF8E50]">Password</FormLabel>

              <FormControl>
                <div className="relative">
                  <Input
                    disabled={loginViewModel.isLoading}
                    type={
                      loginViewModel.isPasswordVisible ? "text" : "password"
                    }
                    className="border border-[#B4B4B4]"
                    {...field}
                  />

                  <button
                    onClick={loginViewModel.togglePasswordVisibility}
                    type="button"
                    className="absolute w-6 h-6 top-1/2 -translate-y-1/2 right-3"
                  >
                    {loginViewModel.isPasswordVisible ? (
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
          disabled={loginViewModel.isLoading}
          type="submit"
          className="bg-[#BF8E50] hover:bg-[#BF8E50]/90 w-full"
        >
          {loginViewModel.isLoading ? "Loading..." : "Masuk"}
        </Button>
      </form>
    </Form>
  );
}

export { LoginView };
