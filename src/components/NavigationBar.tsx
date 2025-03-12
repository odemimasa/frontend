import { useStore } from "@hooks/useStore";
import { NavLink } from "react-router";
import { Chart } from "./Icons/Chart";
import { PersonCircle } from "./Icons/PersonCircle";
import { CheckList } from "./Icons/CheckList";

function NavigationBar() {
  const activeSubscription = useStore((state) => state.activeSubscription);

  return (
    <nav className="bg-white border border-[#E1E1E1] fixed z-20 bottom-0 w-full max-w-sm px-6">
      <ul
        className={`${activeSubscription !== undefined ? "justify-between" : "justify-evenly"} flex items-center py-2`}
      >
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${isActive ? "font-bold py-2 border-b-black" : "border-b-transparent font-medium"} text-sm flex border-b-4 flex-col justify-center gap-1 items-center w-24`
            }
          >
            <Chart className="fill-[#333333] w-6 h-6" />
            Statistik
          </NavLink>
        </li>

        {activeSubscription !== undefined ? (
          <li>
            <NavLink
              to="/to-do-list"
              className={({ isActive }) =>
                `${isActive ? "font-bold py-2 border-b-black" : "border-b-transparent font-medium"} text-sm flex border-b-4 flex-col justify-center gap-1 items-center w-24`
              }
            >
              <CheckList className="fill-[#333333] w-6 h-6" />
              Daftar Ibadah
            </NavLink>
          </li>
        ) : (
          <></>
        )}

        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${isActive ? "font-bold py-2 border-b-black" : "border-b-transparent font-medium"} text-sm flex border-b-4 flex-col justify-center gap-1 items-center w-24`
            }
          >
            <PersonCircle className="fill-[#333333] w-6 h-6" />
            Profil
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export { NavigationBar };
