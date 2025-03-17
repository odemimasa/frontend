import { PersonCircle } from "@components/Icons/PersonCircle";
import { useStore } from "../../stores";
import { Mail } from "@components/Icons/Mail";
import { UserLocationView } from "./UserLocationView";

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
    </>
  );
}

export { ProfilePageView };
