import { Outlet, useLocation, useNavigate } from "react-router";
import { Toaster } from "@components/shadcn/Toaster";
import {
  useStore,
  type AccountType,
  type IndonesiaTimeZone,
  type User,
} from "@hooks/useStore";
import { useAxios } from "@hooks/useAxios";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "@libs/firebase";
import { useToast } from "@hooks/shadcn/useToast";
import { NavigationBar } from "./NavigationBar";
import axios from "axios";
import axiosRetry from "axios-retry";

interface ReverseGeocodingResult {
  results: {
    city: string;
    timezone: {
      name: string;
    };
  }[];
}

function RootLayout(): JSX.Element {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const createAxiosInstance = useAxios();
  const { toast } = useToast();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user !== null) {
        try {
          const idToken = await user.getIdToken();
          const resp = await createAxiosInstance().post<{
            phone_number: string;
            phone_verified: boolean;
            account_type: AccountType;
            upgraded_at: string;
            expired_at: string;
            time_zone: IndonesiaTimeZone;
          }>(
            "/login",
            { id_token: idToken },
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const loggedUser: User = {
            id: user.uid ?? "",
            name: user.displayName ?? "",
            email: user.email ?? "",
            phoneNumber: "",
            phoneVerified: false,
            accountType: "FREE",
            timeZone: undefined,
            latitude: -6.17511,
            longitude: 106.865036,
            idToken,
          };

          const existingLatitude = Number(
            localStorage.getItem("latitude") ?? "0"
          );

          const existingLongitude = Number(
            localStorage.getItem("longitude") ?? "0"
          );

          if (
            loggedUser.latitude !== existingLatitude ||
            loggedUser.longitude !== existingLongitude
          ) {
            if (!navigator.geolocation) {
              toast({
                description: "Fitur lokasi tidak didukung oleh peramban kamu.",
                variant: "destructive",
              });
              return;
            }

            navigator.geolocation.getCurrentPosition(
              async (position) => {
                setIsLoading(true);
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // TODO: update the geocoordinate in the server

                localStorage.setItem("latitude", latitude.toString());
                localStorage.setItem("longitude", longitude.toString());

                const client = axios.create();
                axiosRetry(client, {
                  retries: 3,
                  retryDelay: axiosRetry.exponentialDelay,
                });

                // TODO: reverse geocoding should be moved in the server
                const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&type=city&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`;
                try {
                  const response =
                    await client.get<ReverseGeocodingResult>(url);
                  localStorage.setItem("city", response.data.results[0].city);
                  localStorage.setItem(
                    "timezone",
                    response.data.results[0].timezone.name
                  );

                  toast({
                    description: "Berhasil memperbarui lokasi.",
                    variant: "default",
                  });
                } catch (error) {
                  toast({
                    description: "Gagal memperbarui lokasi.",
                    variant: "destructive",
                  });

                  console.error(
                    new Error("failed to reverse geocoding", { cause: error })
                  );
                } finally {
                  setIsLoading(false);
                }
              },
              (error) => {
                let description = "Gagal memperbarui lokasi.";
                if (error instanceof GeolocationPositionError) {
                  description =
                    "Gagal memperbarui lokasi. Izinkan aplikasi untuk mengakses lokasi kamu.";
                }

                toast({
                  variant: "destructive",
                  description,
                });
              },
              { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
            );
          }

          if (resp.status == 201) {
            setUser(loggedUser);
          } else if (resp.status === 200) {
            setUser({
              ...loggedUser,
              phoneNumber: resp.data.phone_number ?? "",
              phoneVerified: resp.data.phone_verified,
              accountType: resp.data.account_type,
              timeZone: resp.data.time_zone,
            });
          } else if (resp.status === 400) {
            throw new Error("invalid json body");
          } else if (resp.status === 404) {
            throw new Error("invalid id token");
          } else {
            throw new Error(`unknown response status code ${resp.status}`);
          }
        } catch (error) {
          console.error(
            new Error("failed to login with Google", { cause: error })
          );

          toast({
            description: "Gagal login menggunakan akun Google",
            variant: "destructive",
          });
          auth.signOut();
        }
      } else {
        setUser(undefined);
      }
      setIsLoading(false);
    });
  }, [setUser, createAxiosInstance, toast]);

  useEffect(() => {
    if (isLoading) return;

    if (user === undefined && location.pathname !== "/") {
      navigate("/");
      return;
    }

    if (user !== undefined && location.pathname === "/") {
      navigate("/dashboard");
      return;
    }

    // if (user !== undefined) {
    //   if (
    //     (user.phoneVerified === false || user.timeZone === undefined) &&
    //     location.pathname !== "/profile-completion"
    //   ) {
    //     navigate("/profile-completion");
    //     return;
    //   }

    //   if (
    //     user.phoneVerified &&
    //     user.timeZone !== undefined &&
    //     (location.pathname === "/profile-completion" ||
    //       location.pathname === "/")
    //   ) {
    //     navigate("/dashboard");
    //   }
    // }
  }, [isLoading, user, location, navigate]);

  if (isLoading) {
    return <></>;
  }

  if (user === undefined && location.pathname !== "/") {
    return <></>;
  }

  if (user !== undefined && location.pathname === "/") {
    return <></>;
  }

  return (
    <>
      <Toaster />

      <main
        className={`${user !== undefined ? "pb-28" : ""} h-screen overflow-scroll`}
      >
        {user !== undefined ? (
          <div className="border border-[#E1E1E1] rounded-b-[40px] py-2.5">
            <div className="flex justify-center items-center gap-2">
              <img
                src="https://ec3q29jlfx8dke21.public.blob.vercel-storage.com/demi-masa-logo-hqkMxwY4lciC0StHA05IUeeWvw3jfq.png"
                alt="Logo Aplikasi Demi Masa"
                className="w-9"
              />

              <h2 className="text-black font-bold text-xl">Demi Masa</h2>
            </div>
          </div>
        ) : (
          <></>
        )}

        <Outlet />
        {user !== undefined ? <NavigationBar /> : <></>}
      </main>
    </>
  );
}

export { RootLayout };
