import { Location } from "@components/Icons/Location";
import { Logout } from "@components/Icons/Logout";
import { Mail } from "@components/Icons/Mail";
import { PersonCircle } from "@components/Icons/PersonCircle";
import { Button } from "@components/shadcn/Button";
import { useToast } from "@hooks/shadcn/useToast";
import { useStore } from "@hooks/useStore";
import { auth } from "@libs/firebase";
import {
  ExclamationTriangleIcon,
  TrashIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import axios from "axios";
import axiosRetry from "axios-retry";
import { lazy, useState } from "react";

// const UpdateProfileDialog = lazy(() =>
//   import("@components/Profile/UpdateProfileDialog").then(
//     ({ UpdateProfileDialog }) => ({
//       default: UpdateProfileDialog,
//     })
//   )
// );

const DeleteAccountDialog = lazy(() =>
  import("@components/Profile/DeleteAccountDialog").then(
    ({ DeleteAccountDialog }) => ({
      default: DeleteAccountDialog,
    })
  )
);
// const PricingListDialog = lazy(() =>
//   import("@components/Profile/PricingListDialog").then(
//     ({ PricingListDialog }) => ({
//       default: PricingListDialog,
//     })
//   )
// );

interface ReverseGeocodingResult {
  results: {
    city: string;
    timezone: {
      name: string;
    };
  }[];
}

export default function Profile() {
  // const subsDuration = useStore((state) => state.subsDuration);
  const user = useStore((state) => state.user);
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  // const [updateWAOpened, setUpdateWAOpened] = useState(false);
  const [deleteAccountOpened, setDeleteAccountOpened] = useState(false);
  // const [pricingListOpened, setPricingListOpened] = useState(false);

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
          const response = await client.get<ReverseGeocodingResult>(url);
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
  };

  return (
    <>
      <h1 className="text-[#2F3D4A] text-xl font-bold m-6">Profil Pengguna</h1>

      <div className="flex justify-between items-center mb-3 mx-6">
        <div className="flex items-center gap-3">
          <PersonCircle className="text-[#333333] w-5 h-5" />
          <h2 className="text-[#7B7B7B] font-medium">Data Diri</h2>
        </div>

        {/* <Button
          onClick={() => setUpdateWAOpened(true)}
          type="button"
          className="bg-[#BF8E50] hover:bg-[#BF8E50]/90 flex justify-center items-center gap-2"
        >
          <Pencil1Icon className="text-white" />
          Edit
        </Button> */}

        {/* {updateWAOpened ? (
          <UpdateProfileDialog
            open={updateWAOpened}
            setOpen={setUpdateWAOpened}
          />
        ) : (
          <></>
        )} */}
      </div>

      <div className="flex items-center gap-3 border border-[#C2C2C2] rounded-2xl p-3.5 mx-6">
        <PersonCircle className="text-[#333333] w-8 h-8" />

        <div>
          <h3 className="text-[#7B7B7B] font-medium text-xs">
            Assalamu'alaikum
          </h3>
          <p className="text-[#7B7B7B] font-bold text-sm">{user?.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 border border-[#C2C2C2] rounded-2xl p-3.5 mx-6 my-3.5">
        <Mail className="fill-[#333333] w-8 h-8" />

        <div>
          <h3 className="text-[#7B7B7B] font-medium text-xs">Email</h3>
          <p className="text-[#7B7B7B] font-bold text-sm">{user?.email}</p>
        </div>
      </div>

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

      {/* <div className="flex items-center gap-3 mt-6 mx-6 mb-3.5">
        <ShoppingBag className="fill-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Paket Saya</h2>
      </div> */}

      {/* {user?.accountType === "PREMIUM" ? (
        <div className="bg-[#BF8E50] rounded-2xl p-6 mx-6">
          <Badge className="bg-white hover:bg-white text-black">Premium</Badge>

          <p className="text-white text-sm mt-3.5">
            Berlaku hingga: <strong>{subsDuration}</strong>
          </p>

          <Button
            disabled
            type="button"
            className="bg-white hover:bg-white/90 text-[#363636] mt-3.5"
          >
            <Wallet className="fill-[#363636]" />
            Beli Paket
          </Button>
        </div>
      ) : (
        <div className="border border-[#C2C2C2] rounded-2xl p-6  mx-6">
          <Badge variant="outline" className="text-black border-[#E1E1E1]">
            Free
          </Badge>

          <p className="text-[#363636] font-bold text-sm mt-3.5">
            Beli Paket Premiun, Nikmati Semua Layanan
          </p>

          <Button
            onClick={() => setPricingListOpened(true)}
            type="button"
            variant="outline"
            className="text-[#363636] border-[#2F3D4A] mt-3.5"
          >
            <Wallet className="fill-[#363636]" />
            Beli Paket
          </Button>

          {pricingListOpened ? (
            <PricingListDialog
              open={pricingListOpened}
              setOpen={setPricingListOpened}
            />
          ) : (
            <></>
          )}
        </div>
      )} */}

      {/* <div className="flex items-center gap-3 mt-6 mb-3.5 mx-6">
        <History className="fill-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Riwayat Transaksi</h2>
      </div> */}

      {/* <TxHistory /> */}

      <div className="flex items-center gap-3 mt-6 mb-3.5 mx-6">
        <Logout className="fill-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Keluar</h2>
      </div>

      <div className="border border-[#E1E1E1] rounded-2xl p-6 mx-6">
        <p className="text-black text-center text-sm mb-4">
          Ingin keluar akun? klik tombol di bawah ini
        </p>

        <Button
          onClick={() => auth.signOut()}
          type="button"
          variant="outline"
          className="text-[#2F3D4A] w-full"
        >
          Keluar
        </Button>
      </div>

      <div className="flex items-center gap-3 mt-6 mb-3.5 mx-6">
        <TrashIcon className="text-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Hapus Akun</h2>
      </div>

      <div className="bg-[#D9534F] rounded-2xl p-6 mx-6">
        <p className="text-white font-bold text-sm flex items-center gap-3.5 mb-4">
          <ExclamationTriangleIcon className="text-white w-6 h-6 shrink-0" />
          Ingin hapus akun? klik tombol di bawah ini
        </p>

        <Button
          onClick={() => setDeleteAccountOpened(true)}
          type="button"
          className="bg-white hover:bg-white/90 text-[#D9534F] w-full"
        >
          Hapus Akun
        </Button>

        {deleteAccountOpened ? (
          <DeleteAccountDialog
            open={deleteAccountOpened}
            setOpen={setDeleteAccountOpened}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
