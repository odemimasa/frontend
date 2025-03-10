import { Button } from "@components/shadcn/Button";
import { useToast } from "@hooks/shadcn/useToast";
import { useStore, type User } from "@hooks/useStore";
import { tokenStorage } from "@utils/token";
import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/AuthProvider";

function LoginAndRegister() {
  const { retryWithoutRefresh } = useAuthContext();
  const [isRegisterView, setIsRegisterView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const setUser = useStore((state) => state.setUser);

  const handleAuth = useCallback(
    async (response: { credential: string }) => {
      setIsLoading(true);
      const URL = isRegisterView ? "/auth/register" : "/auth/login";

      try {
        const res = await retryWithoutRefresh.post<{
          user: User;
          access_token: string;
          refresh_token: string;
        }>(URL, { id_token: response.credential });

        if (res.status === 200 || res.status === 201) {
          tokenStorage.setAccessToken(res.data.access_token);
          tokenStorage.setRefreshToken(res.data.refresh_token);
          setUser(res.data.user);
        } else if (res.status === 404) {
          toast({
            description: "Akun tidak ditemukan, silakan melakukan registrasi.",
            variant: "destructive",
          });
        } else if (res.status === 409) {
          toast({
            description:
              "Akun Google telah terdaftar, gunakan akun Google yang lain.",
            variant: "destructive",
          });
        } else {
          throw new Error(`unhandled response status ${res.status}`);
        }
      } catch (error) {
        console.error(
          new Error(
            `failed to ${isRegisterView ? "register" : "login"} with google account`,
            { cause: error }
          )
        );

        toast({
          description: `Gagal ${isRegisterView ? "registrasi" : "login"} menggunakan akun Google, silakan coba kembali.`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isRegisterView, toast, setUser]
  );

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    window.handleAuth = handleAuth;
    loadGoogleScript();

    return () => {
      const script = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );

      if (script) {
        document.body.removeChild(script);
      }

      delete window.handleAuth;
    };
  }, [handleAuth]);

  console.log(isLoading);

  return (
    <div
      id="login-section"
      className="bg-[url('https://ec3q29jlfx8dke21.public.blob.vercel-storage.com/sunset-TfWM2wgOqUOYBYYM8D6FSw56IY0zCs.jpg')] bg-cover bg-center mt-32 px-6 py-16"
    >
      <div className="bg-white/90 rounded-2xl overflow-hidden flex flex-col justify-between gap-4">
        <div className="bg-black/75 grid place-items-center rounded-b-[40px] h-14 mb-6">
          <h2 className="text-white font-bold text-lg">
            Mulai Perjalanan Ibadah
          </h2>
        </div>

        <div className="mx-auto">
          <div
            id="g_id_onload"
            data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            data-context={isRegisterView ? "signup" : "signin"}
            data-ux_mode="popup"
            data-callback="handleAuth"
            data-auto_prompt="false"
          ></div>

          <div
            className="g_id_signin"
            data-type="standard"
            data-shape="pill"
            data-theme="filled_blue"
            data-text={isRegisterView ? "signup_with" : "signin_with"}
            data-size="medium"
            data-logo_alignment="left"
          ></div>
        </div>

        <Button
          onClick={() => setIsRegisterView(!isRegisterView)}
          variant="link"
          className="text-blue-600 block w-fit ml-auto"
        >
          {isRegisterView ? "Sudah" : "Belum"} memiliki akun?
        </Button>
      </div>
    </div>
  );
}

export { LoginAndRegister };
