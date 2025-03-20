import { PersonCircle } from "@components/Icons/PersonCircle";
import { ShoppingBag } from "@components/Icons/ShoppingBag";
import { Skeleton } from "@components/shadcn/Skeleton";
import { SubscriptionSkeletonView } from "./SubscriptionSkeletonView";
import {
  ExclamationTriangleIcon,
  FileTextIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { InvoiceSkeletonView } from "./InvoiceSkeletonView";
import { History } from "@components/Icons/History";
import { PaymentsSkeletonView } from "./PaymentsSkeletonView";
import { Logout } from "@components/Icons/Logout";
import { Button } from "@components/shadcn/Button";
import { DemiMasaHeaderView } from "../DemiMasaHeaderView";

function ProfilePageSkeletonView() {
  return (
    <>
      <DemiMasaHeaderView />

      <h1 className="text-[#2F3D4A] text-xl font-bold m-6">Profil Pengguna</h1>

      <div className="flex justify-between items-center mb-3 mx-6">
        <div className="flex items-center gap-3">
          <PersonCircle className="text-[#333333] w-5 h-5" />
          <h2 className="text-[#7B7B7B] font-medium">Data Diri</h2>
        </div>
      </div>

      <div className="flex items-center gap-3 animate-pulse border border-[#C2C2C2] rounded-2xl p-3.5 mx-6">
        <Skeleton className="w-8 h-8 rounded-full" />

        <div>
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <div className="flex items-center gap-3 animate-pulse border border-[#C2C2C2] rounded-2xl p-3.5 mx-6 my-3.5">
        <Skeleton className="w-8 h-8 rounded-full" />

        <div>
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <div className="flex items-center gap-3 animate-pulse border border-[#C2C2C2] rounded-2xl p-3.5 mx-6">
        <Skeleton className="w-8 h-8 rounded-full" />

        <div>
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6 mx-6 mb-3.5">
        <ShoppingBag className="fill-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Paket Saya</h2>
      </div>

      <SubscriptionSkeletonView />

      <div className="flex items-center gap-3 mt-6 mx-6 mb-3.5">
        <FileTextIcon className="text-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Tagihan Saya</h2>
      </div>

      <InvoiceSkeletonView />

      <div className="flex items-center gap-3 mt-6 mb-3.5 mx-6">
        <History className="fill-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Riwayat Transaksi</h2>
      </div>

      <PaymentsSkeletonView />

      <div className="flex items-center gap-3 mt-6 mb-3.5 mx-6">
        <Logout className="fill-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Keluar</h2>
      </div>

      <div className="border border-[#E1E1E1] rounded-2xl p-6 mx-6">
        <p className="text-black text-center text-sm mb-4">
          Ingin keluar akun? klik tombol di bawah ini
        </p>

        <Button
          disabled
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
          disabled
          type="button"
          className="bg-white hover:bg-white/90 text-[#D9534F] disabled:text-[#2F3D4A] w-full"
        >
          Hapus Akun
        </Button>
      </div>
    </>
  );
}

export { ProfilePageSkeletonView };
