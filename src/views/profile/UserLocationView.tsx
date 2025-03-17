import { Location } from "@components/Icons/Location";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { UserModel } from "../../models/UserModel";
import { useUserLocationViewModel } from "../../viewmodels/profile/useUserLocationViewModel";
import { Button } from "@components/shadcn/Button";
import { UpdateIcon } from "@radix-ui/react-icons";

function UserLocationView() {
  const { retryWithRefresh } = useAxiosContext();
  const userModel = new UserModel(retryWithRefresh);
  const userLocationViewModel = useUserLocationViewModel(userModel);

  return (
    <div className="flex justify-between items-center border border-[#C2C2C2] rounded-2xl p-3.5 mx-6">
      <div className="flex justify-between items-center gap-3">
        <Location className="text-[#333333] w-8 h-8" />

        <div>
          <h3 className="text-[#7B7B7B] font-medium text-xs">Lokasi</h3>
          <p className="text-[#7B7B7B] font-bold text-sm">
            {userLocationViewModel.userCity}
          </p>
        </div>
      </div>

      <Button
        onClick={userLocationViewModel.updateLocation}
        disabled={userLocationViewModel.isLoading}
        type="button"
        className="bg-[#BF8E50] hover:bg-[#BF8E50]/90 flex justify-center items-center gap-2"
      >
        {userLocationViewModel.isLoading ? (
          <div className="animate-spin w-4 h-4 border-2 border-white/25 border-b-white rounded-full"></div>
        ) : (
          <UpdateIcon className="w-4 h-4" />
        )}
        Perbarui
      </Button>
    </div>
  );
}

export { UserLocationView };
