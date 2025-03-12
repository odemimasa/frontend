import { useToast } from "@hooks/shadcn/useToast";
import {
  useStore,
  type ActiveInvoice,
  type SubscriptionPlan,
} from "@hooks/useStore";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useAuthContext } from "../../contexts/AuthProvider";
import type { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/shadcn/AlertDialog";
import { Button } from "@components/shadcn/Button";

interface SubscriptionPlanButtonProps extends SubscriptionPlan {
  couponCode: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function SubscriptionPlanButton({
  id,
  type,
  name,
  price,
  duration_in_months,
  created_at,
  couponCode,
  setOpen,
}: SubscriptionPlanButtonProps) {
  const user = useStore((state) => state.user);
  const setActiveInvoice = useStore((state) => state.setActiveInvoice);

  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpened, setDialogOpened] = useState(false);
  const { toast } = useToast();
  const { retryWithRefresh } = useAuthContext();

  const handleCreateInvoice = async () => {
    setIsLoading(true);
    try {
      const res = await retryWithRefresh.post<ActiveInvoice>(
        "/invoices",
        {
          coupon_code: couponCode,
          customer_name: user?.name,
          customer_email: user?.email,
          plan: {
            id,
            type,
            name,
            price,
            duration_in_months,
          },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 201) {
        setOpen(false);
        setDialogOpened(false);
        setActiveInvoice({
          ...res.data,
          plan: { id, type, name, price, duration_in_months, created_at },
        });

        toast({
          description: `Berhasil membuat tagihan untuk berlangganan paket ${name}.`,
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
          description: `Gagal membuat tagihan untuk berlangganan paket ${name}.`,
          variant: "destructive",
        });
      }

      console.error(new Error("failed to create invoice", { cause: error }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        key={id}
        disabled={isLoading}
        onClick={() => setDialogOpened(true)}
        type="button"
        className="bg-[#BF8E50] rounded-lg py-2"
      >
        <span className="text-[#363636] block font-bold text-center">
          {name}
        </span>

        <span className="text-white flex justify-center items-center gap-0.5">
          <span className="font-medium text-xs">Rp</span>
          <span className="font-bold text-[26px]">
            {Intl.NumberFormat("id-ID").format(price)}-
          </span>
          <span className="font-medium text-xs">
            /{duration_in_months} Bulan
          </span>
        </span>
      </button>

      <AlertDialog open={dialogOpened} onOpenChange={setDialogOpened}>
        <AlertDialogContent className="max-w-sm mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Apakah kamu yakin ingin berlangganan {duration_in_months} bulan?
            </AlertDialogTitle>

            <AlertDialogDescription asChild>
              <div>
                <p className="font-bold mb-2">Catatan:</p>
                <ul className="list-disc text-sm flex flex-col gap-2 ml-6">
                  <li>Pembayaran hanya melalui QRIS.</li>

                  <li>
                    Tagihan akan hangus jika melewati batas waktu yang telah
                    ditentukan.
                  </li>

                  <li>
                    Status akun akan diperbarui menjadi premium setelah
                    pembayaran berhasil.
                  </li>

                  <li>
                    Jika status akun tidak diperbarui 10 menit setelah
                    pembayaran, hubungi kami.
                  </li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-4">
            <AlertDialogCancel
              disabled={isLoading}
              type="button"
              className="w-full"
            >
              Batal
            </AlertDialogCancel>

            <Button
              disabled={isLoading}
              onClick={handleCreateInvoice}
              type="button"
              className="bg-[#BF8E50] hover:bg-[#BF8E50]/90 text-white hover:text-white w-full"
            >
              {isLoading ? "Loading..." : "Proses Transaksi"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { SubscriptionPlanButton };
