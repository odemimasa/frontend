import { CheckIcon } from "@radix-ui/react-icons";
import type { Dispatch, SetStateAction } from "react";
import type { PricingPlan } from "../../viewmodels/profile/usePlansDialogViewModel";
import { PlanButtonView } from "./PlanButtonView";

interface PricingPlanViewProps {
  pricingPlan: PricingPlan | undefined;
  couponCode: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function PlansView({
  pricingPlan,
  couponCode,
  setIsOpen,
}: PricingPlanViewProps) {
  if (pricingPlan === undefined) {
    return (
      <p className="text-[#D9534F] text-center font-medium border border-[#D9534F] rounded-2xl p-6 mt-6">
        Tidak dapat menampilkan daftar harga langganan.
      </p>
    );
  }

  if (pricingPlan.size === 0) {
    return (
      <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mt-6">
        Daftar harga langganan kosong.
      </p>
    );
  }

  return Array.from(pricingPlan.entries()).map(([key, value]) => {
    return (
      <div
        key={key}
        className="border border-[#BF8E50] rounded-2xl overflow-hidden pb-6 mt-6"
      >
        <h3 className="bg-[#BF8E50] text-white font-bold text-center text-xl py-3 mb-6 capitalize">
          {key}
        </h3>

        <div className="flex flex-col gap-4 mb-4 mx-6">
          {value.map((item) => {
            return (
              <PlanButtonView
                key={item.id}
                plan={item}
                couponCode={couponCode}
                setIsOpen={setIsOpen}
              />
            );
          })}
        </div>

        <hr className="border-[#C2C2C2] my-7" />

        <ul className="flex flex-col gap-4 mx-6">
          <li className="text-[#363636] text-sm flex items-center gap-3 line-through">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" /> Pengingat
            salat 5 waktu melalui WhatsApp (Coming Soon)
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3 line-through">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" /> Notifikasi
            saat masuk waktu salat (Coming Soon)
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3 line-through">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />
            Notifikasi saat waktu salat tersisa 25% (Coming Soon)
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />
            Manajemen ibadah melalui to-do list
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" /> Laporan
            kemajuan ibadah tak terbatas
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" /> Grafik
            salat 5 waktu
          </li>
        </ul>
      </div>
    );
  });
}

export { PlansView };
