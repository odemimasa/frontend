import { CheckIcon, TimerIcon } from "@radix-ui/react-icons";
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

        <p className="text-[#363636]/50 text-sm mx-6 font-medium mt-7">
          <strong>Note</strong>: Harga di atas berlaku untuk 1000 pengguna
          pertama
        </p>

        <hr className="border-[#C2C2C2] my-7" />

        <ul className="flex flex-col gap-4 mx-6">
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />
            Gratis untuk mendapatkan update setiap fitur terbaru
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />
            Database salat 5 waktu
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />
            Database habit tracker untuk setiap salat
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />
            Multi-line chart untuk melihat grafik salat Anda setiap hari
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />
            Leaderboard untuk melihat salat Anda yang paling sering ditunda
          </li>
          <li className="text-[#363636]/50 text-sm flex items-center gap-3">
            <TimerIcon className="text-[#333] shrink-0 w-6 h-6 scale-75" />
            <span>
              Pengingat salat melalui WhatsApp (<strong>Coming Soon</strong>)
            </span>
          </li>
          <li className="text-[#363636]/50 text-sm flex items-center gap-3">
            <TimerIcon className="text-[#333] shrink-0 w-6 h-6 scale-75" />
            <span>
              Widget untuk home screen dan lock screen (
              <strong>Coming Soon</strong>)
            </span>
          </li>
        </ul>
      </div>
    );
  });
}

export { PlansView };
