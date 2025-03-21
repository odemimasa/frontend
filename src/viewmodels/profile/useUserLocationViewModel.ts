import { useState } from "react";
import type { UserModel } from "../../models/UserModel";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useToast } from "@hooks/shadcn/useToast";
import { useStore } from "../../stores";

function useUserLocationViewModel(userModel: UserModel) {
  const [isLoading, setIsLoading] = useState(false);

  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const setPrayers = useStore((state) => state.setPrayers);

  const { handleAxiosError } = useAxiosContext();
  const { toast } = useToast();

  const updateLocation = () => {
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

        try {
          const res = await userModel.updateUser({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          });

          if (res.status === 200) {
            toast({
              description: "Berhasil memperbarui lokasi.",
              variant: "default",
            });

            setPrayers(undefined);
            setUser((user) => {
              if (user === undefined) {
                return user;
              }

              return {
                ...user,
                timezone: res.data.timezone,
                city: res.data.city,
                latitude,
                longitude,
              };
            });
          }
        } catch (error) {
          handleAxiosError(error as Error, (response) => {
            if (response.status === 400) {
              console.error(new Error("invalid request body"));
            } else if (response.status === 404) {
              toast({
                description: "Gagal memperbarui lokasi. Akun tidak ditemukan.",
                variant: "destructive",
              });
            }
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        let description = "Gagal memperbarui lokasi. Silakan coba kembali.";
        if (error instanceof GeolocationPositionError) {
          description =
            "Gagal memperbarui lokasi. Izinkan aplikasi untuk mengakses lokasi kamu.";
        }

        toast({ variant: "destructive", description });
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
    );
  };

  return { isLoading, updateLocation, userCity: user?.city ?? "Jakarta" };
}

export { useUserLocationViewModel };
