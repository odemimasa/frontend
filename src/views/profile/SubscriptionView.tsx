import { Wallet } from "@components/Icons/Wallet";
import { Badge } from "@components/shadcn/Badge";
import { Button } from "@components/shadcn/Button";
import { formatISODate } from "@utils/index";
import { lazy, useState } from "react";
import { useStore } from "../../stores";

const PlansDialogView = lazy(() =>
  import("./PlansDialogView").then(({ PlansDialogView }) => ({
    default: PlansDialogView,
  }))
);

function SubscriptionView() {
  const [isOpen, setIsOpen] = useState(false);

  const user = useStore((state) => state.user);
  const invoice = useStore((state) => state.invoice);

  if (user === undefined) {
    return (
      <p className="text-[#D9534F] text-center font-medium border border-[#D9534F] rounded-2xl p-6 mx-6">
        Tidak dapat menampilkan langganan.
      </p>
    );
  }

  if (user.subscription === null) {
    return (
      <div className="border border-[#C2C2C2] rounded-2xl p-6  mx-6">
        <Badge variant="outline" className="text-black border-[#E1E1E1]">
          Free
        </Badge>

        <p className="text-[#363636] font-bold text-sm mt-3.5">
          Beli Paket Premiun, Nikmati Semua Layanan
        </p>

        <Button
          disabled={!!invoice}
          onClick={() => setIsOpen(true)}
          type="button"
          variant="outline"
          className="text-[#363636] border-[#2F3D4A] mt-3.5"
        >
          <Wallet className="fill-[#363636]" />
          Beli Paket
        </Button>

        {isOpen ? (
          <PlansDialogView isOpen={isOpen} setIsOpen={setIsOpen} />
        ) : (
          <></>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#BF8E50] rounded-2xl p-6 mx-6">
      <Badge className="bg-white hover:bg-white text-black">Premium</Badge>

      <p className="text-white text-sm mt-3.5">
        Berlaku hingga:&nbsp;
        <strong>
          {formatISODate(user.subscription.end_date, user.timezone)}
        </strong>
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
  );
}

export { SubscriptionView };
