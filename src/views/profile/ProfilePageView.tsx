import { PersonCircle } from "@components/Icons/PersonCircle";
import { useStore } from "../../stores";
import { Mail } from "@components/Icons/Mail";
import { UserLocationView } from "./UserLocationView";
import { ShoppingBag } from "@components/Icons/ShoppingBag";
import { SubscriptionView } from "./SubscriptionView";
import { FileTextIcon, TrashIcon } from "@radix-ui/react-icons";
import { InvoiceView } from "./InvoiceView";
import { PaymentsView } from "./PaymentsView";
import { History } from "@components/Icons/History";
import { Logout } from "@components/Icons/Logout";
import { LogoutView } from "./LogoutView";
import { DeleteAccountView } from "./DeleteAccountView";

function ProfilePageView() {
  const user = useStore((state) => state.user);

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
          <p className="text-[#7B7B7B] font-bold text-sm">
            {user?.name ?? "John Doe"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 border border-[#C2C2C2] rounded-2xl p-3.5 mx-6 my-3.5">
        <Mail className="fill-[#333333] w-8 h-8" />

        <div>
          <h3 className="text-[#7B7B7B] font-medium text-xs">Email</h3>
          <p className="text-[#7B7B7B] font-bold text-sm">
            {user?.email ?? "example@gmail.com"}
          </p>
        </div>
      </div>

      <UserLocationView />

      <div className="flex items-center gap-3 mt-6 mx-6 mb-3.5">
        <ShoppingBag className="fill-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Paket Saya</h2>
      </div>

      <SubscriptionView />

      <div className="flex items-center gap-3 mt-6 mx-6 mb-3.5">
        <FileTextIcon className="text-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Tagihan Saya</h2>
      </div>

      <InvoiceView />

      <div className="flex items-center gap-3 mt-6 mb-3.5 mx-6">
        <History className="fill-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Riwayat Transaksi</h2>
      </div>

      <PaymentsView />

      <div className="flex items-center gap-3 mt-6 mb-3.5 mx-6">
        <Logout className="fill-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Keluar</h2>
      </div>

      <LogoutView />

      <div className="flex items-center gap-3 mt-6 mb-3.5 mx-6">
        <TrashIcon className="text-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Hapus Akun</h2>
      </div>

      <DeleteAccountView />
    </>
  );
}

export { ProfilePageView };
