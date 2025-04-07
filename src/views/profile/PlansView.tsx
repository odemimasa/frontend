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
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />
            Five-times prayer database
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />
            Daily prayer habit tracker database
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />
            Database daily salat checklist
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />
            Prayer development chart
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />
            The most punctual prayer board
          </li>
        </ul>
      </div>
    );
  });
}

export { PlansView };
