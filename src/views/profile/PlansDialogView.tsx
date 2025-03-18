import { Button } from "@components/shadcn/Button";
import { Dialog, DialogContent } from "@components/shadcn/Dialog";
import { Input } from "@components/shadcn/Input";
import { Label } from "@components/shadcn/Label";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { PlanModel } from "../../models/PlanModel";
import { Skeleton } from "@components/shadcn/Skeleton";
import { usePlansDialogViewModel } from "../../viewmodels/profile/usePlansDialogViewModel";
import { PlansView } from "./PlansView";
import { CouponModel } from "../../models/CouponModel";

interface PlansViewProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function PlansDialogView({ isOpen, setIsOpen }: PlansViewProps) {
  const { retryWithRefresh } = useAxiosContext();

  const planModel = useMemo((): PlanModel => {
    return new PlanModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const couponModel = useMemo((): CouponModel => {
    return new CouponModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const plansDialogViewModel = usePlansDialogViewModel(planModel, couponModel);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm mx-auto [&>*:last-child]:hidden">
        <div className="h-screen overflow-scroll no-scrollbar py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[#2F3D4A] font-bold text-xl">
              Pilih Jenis Reminder Anda
            </h1>

            <button onClick={() => setIsOpen(false)} type="button">
              <Cross2Icon className="text-[#333333] w-6 h-6" />
            </button>
          </div>

          <form
            action=""
            className="border border-[#C2C2C2] rounded-2xl px-5 py-3"
          >
            <div className="flex justify-between items-center">
              <Label
                htmlFor="coupon_code"
                className="text-black font-bold text-base mb-2 block"
              >
                Kode Influencer
              </Label>

              <p className="text-[#757575] text-xs font-medium">
                Sisa Kode: {plansDialogViewModel.coupon?.quota ?? "_"}
              </p>
            </div>

            <Input
              value={plansDialogViewModel.couponCode}
              onChange={(event) =>
                plansDialogViewModel.setCouponCode(event.currentTarget.value)
              }
              id="coupon_code"
              type="text"
              autoComplete="off"
              className="mb-4"
            />

            <Button
              onClick={() =>
                plansDialogViewModel.getCoupon(plansDialogViewModel.couponCode)
              }
              disabled={
                plansDialogViewModel.couponCode === "" ||
                plansDialogViewModel.isLoading
              }
              type="submit"
              variant="outline"
              className="border-[#2F3D4A]"
            >
              {plansDialogViewModel.couponCode !== "" &&
              plansDialogViewModel.isLoading
                ? "Loading..."
                : "Cek Kuota"}
            </Button>
          </form>

          {plansDialogViewModel.couponCode === "" &&
          plansDialogViewModel.isLoading ? (
            <div className="animate-pulse border rounded-2xl overflow-hidden flex flex-col space-y-6 my-6 pb-6">
              <Skeleton className="h-16" />
              <Skeleton className="h-8 w-32 mx-auto rounded-xl" />
              <div className="space-y-4 mx-6">
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
              </div>
            </div>
          ) : (
            <PlansView
              pricingPlan={plansDialogViewModel.pricingPlan}
              couponCode={plansDialogViewModel.couponCode}
              setIsOpen={setIsOpen}
            />
          )}

          <div className="border border-[#C2C2C2] rounded-2xl py-6 mt-6">
            <h3 className="text-[#363636] font-bold text-center text-xl mb-2">
              Gratis
            </h3>

            <p className="text-[#7B7B7B] text-center text-sm mb-4">
              Akhir Bulan Tak Masalah
            </p>

            <Button
              disabled
              type="button"
              variant="outline"
              className="text-center block w-32 mx-auto"
            >
              Pilih Paket
            </Button>

            <hr className="border-[#C2C2C2] my-7" />

            <ul className="flex flex-col gap-4 mx-6">
              <li className="text-[#363636] text-sm flex items-center gap-3">
                <CheckIcon className="text-[#363636] shrink-0 w-6 h-6" />{" "}
                Pengingat salat 5 waktu melalui WhatsApp
              </li>
              <li className="text-[#363636] text-sm flex items-center gap-3">
                <CheckIcon className="text-[#363636] shrink-0 w-6 h-6" />{" "}
                Notifikasi saat masuk waktu salat
              </li>
              <li className="text-[#363636] text-sm flex items-center gap-3">
                <Cross2Icon className="text-[#363636] shrink-0 w-6 h-6" />
                Notifikasi saat waktu salat tersisa 25%
              </li>
              <li className="text-[#363636] text-sm flex items-center gap-3">
                <Cross2Icon className="text-[#363636] shrink-0 w-6 h-6" />
                Manajemen ibadah melalui to-do list
              </li>
              <li className="text-[#363636] text-sm flex items-center gap-3">
                <Cross2Icon className="text-[#363636] shrink-0 w-6 h-6" />{" "}
                Laporan kemajuan ibadah tak terbatas
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { PlansDialogView };
