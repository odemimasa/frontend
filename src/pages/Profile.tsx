import { Logout } from "@components/Icons/Logout";
import { Mail } from "@components/Icons/Mail";
import { PersonCircle } from "@components/Icons/PersonCircle";
import { UserLocation } from "@components/Profile/UserLocation";
import { Button } from "@components/shadcn/Button";
import { useStore } from "@hooks/useStore";
import { ExclamationTriangleIcon, TrashIcon } from "@radix-ui/react-icons";
import { lazy, useState } from "react";

const DeleteAccountDialog = lazy(() =>
  import("@components/Profile/DeleteAccountDialog").then(
    ({ DeleteAccountDialog }) => ({
      default: DeleteAccountDialog,
    })
  )
);

const LogoutDialog = lazy(() =>
  import("@components/Profile/LogoutDialog").then(({ LogoutDialog }) => ({
    default: LogoutDialog,
  }))
);
// const PricingListDialog = lazy(() =>
//   import("@components/Profile/PricingListDialog").then(
//     ({ PricingListDialog }) => ({
//       default: PricingListDialog,
//     })
//   )
// );

export default function Profile() {
  // const subsDuration = useStore((state) => state.subsDuration);
  const user = useStore((state) => state.user);
  const [deleteAccountOpened, setDeleteAccountOpened] = useState(false);
  const [logoutOpened, setLogoutOpened] = useState(false);
  // const [pricingListOpened, setPricingListOpened] = useState(false);

  return (
    <>
      <h1 className="text-[#2F3D4A] text-xl font-bold m-6">Profil Pengguna</h1>

      <div className="flex justify-between items-center mb-3 mx-6">
        <div className="flex items-center gap-3">
          <PersonCircle className="text-[#333333] w-5 h-5" />
          <h2 className="text-[#7B7B7B] font-medium">Data Diri</h2>
        </div>
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

      <UserLocation />

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
          onClick={() => setLogoutOpened(true)}
          type="button"
          variant="outline"
          className="text-[#2F3D4A] w-full"
        >
          Keluar
        </Button>

        {logoutOpened ? (
          <LogoutDialog open={logoutOpened} setOpen={setLogoutOpened} />
        ) : (
          <></>
        )}
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
