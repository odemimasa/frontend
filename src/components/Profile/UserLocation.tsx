import { Location } from "@components/Icons/Location";
import { Button } from "@components/shadcn/Button";
import { useToast } from "@hooks/shadcn/useToast";
import { useStore } from "@hooks/useStore";
import { UpdateIcon } from "@radix-ui/react-icons";
import type { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { useState } from "react";
import { useAxiosContext } from "../../contexts/AxiosProvider";

function UserLocation() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const setPrayers = useStore((state) => state.setPrayers);

  const [isLoading, setIsLoading] = useState(false);
  const { retryWithRefresh } = useAxiosContext();
  const { toast } = useToast();

  const updateLocation = async () => {
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
          const res = await retryWithRefresh.put<{
            timezone: string;
            city: string;
          }>(`/users/me`, {
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          });

          if (res.status === 200) {
            setPrayers(undefined);

            setUser({
              ...user!,
              timezone: res.data.timezone,
              city: res.data.city,
              latitude,
              longitude,
            });

            toast({
              description: "Berhasil memperbarui lokasi.",
              variant: "default",
            });
          }
        } catch (error) {
          const status = (error as AxiosError).response?.status;
          if (
            axiosRetry.isNetworkError(error as AxiosError) ||
            (status || 0) >= 500
          ) {
            toast({
              description: "Gagal memperbarui lokasi.",
              variant: "destructive",
            });
          }

          console.error(
            new Error("failed to update user location", { cause: error })
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
  };

  return (
    <div className="flex justify-between items-center border border-[#C2C2C2] rounded-2xl p-3.5 mx-6">
      <div className="flex justify-between items-center gap-3">
        <Location className="text-[#333333] w-8 h-8" />

        <div>
          <h3 className="text-[#7B7B7B] font-medium text-xs">Lokasi</h3>
          <p className="text-[#7B7B7B] font-bold text-sm">
            {user?.city ?? "Unknown"}
          </p>
        </div>
      </div>

      <Button
        onClick={() => updateLocation()}
        disabled={isLoading}
        type="button"
        className="bg-[#BF8E50] hover:bg-[#BF8E50]/90 flex justify-center items-center gap-2"
      >
        {isLoading ? (
          <div className="animate-spin w-4 h-4 border-2 border-white/25 border-b-white rounded-full"></div>
        ) : (
          <UpdateIcon className="w-4 h-4" />
        )}
        Perbarui
      </Button>
    </div>
  );
}

export { UserLocation };
