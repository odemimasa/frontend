import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  timezone: string;
  created_at: string;
}

type PaymentStatus = "paid" | "expired" | "failed" | "refund";

interface ActiveInvoice {
  id: string;
  plan: SubscriptionPlan;
  ref_id: string;
  coupon_code: string;
  total_amount: number;
  qr_url: string;
  expires_at: string;
  created_at: string;
}

interface Payment {
  id: string;
  invoice_id: string;
  amount_paid: number;
  status: PaymentStatus;
  created_at: string;
}

interface SubscriptionPlan {
  id: string;
  type: "premium";
  name: string;
  price: number;
  duration_in_months: number;
  created_at: string;
}

type SubscriptionPlanMap = Map<string, SubscriptionPlan[]>;

interface ToDoList {
  id: string;
  name: string;
  description: string;
  checked: boolean;
}

type PrayerStatus = "pending" | "on_time" | "late" | "missed";
type PrayerName = "subuh" | "zuhur" | "asar" | "magrib" | "isya";

interface Prayer {
  id: string;
  name: PrayerName;
  status: PrayerStatus;
  date: Date;
}

// the value of the map will only have 3 length
// the first index is the number of missed salat
// the second index is the number of late salat
// the third index is the number of on time salat
type PrayerStatistic = Map<PrayerName, number[]>;

interface ActiveSubscription {
  id: string;
  plan_id: string;
  payment_id: string;
  start_date: string;
  end_date: string;
}

interface States {
  user: User | undefined;
  payments: Payment[] | undefined;
  subscriptionPlans: SubscriptionPlanMap | undefined;
  toDoLists: ToDoList[] | undefined;
  prayers: Prayer[] | undefined;
  prayerStatistic: PrayerStatistic | undefined;
  subsDuration: string;
  activeSubscription: ActiveSubscription | undefined;
  activeInvoice: ActiveInvoice | undefined;
}

interface Actions {
  setUser: (
    user: ((user: User | undefined) => User | undefined) | User | undefined
  ) => void;
  setPayments: (
    payments:
      | ((payments: Payment[] | undefined) => Payment[] | undefined)
      | Payment[]
      | undefined
  ) => void;
  setSubscriptionPlans: (
    subscriptionPlans:
      | ((
          subscriptionPlans: SubscriptionPlanMap | undefined
        ) => SubscriptionPlanMap | undefined)
      | SubscriptionPlanMap
      | undefined
  ) => void;
  setToDoLists: (
    toDoLists:
      | ((toDoLists: ToDoList[] | undefined) => ToDoList[] | undefined)
      | ToDoList[]
      | undefined
  ) => void;
  setPrayers: (
    prayers:
      | ((prayers: Prayer[] | undefined) => Prayer[] | undefined)
      | Prayer[]
      | undefined
  ) => void;
  setPrayerStatistic: (
    prayerStatistic:
      | ((
          prayerStatistic: PrayerStatistic | undefined
        ) => PrayerStatistic | undefined)
      | PrayerStatistic
      | undefined
  ) => void;
  setSubsDuration: (prayerStatistic: string) => void;
  setActiveSubscription: (
    activeSubscription:
      | ((
          activeSubscription: ActiveSubscription | undefined
        ) => ActiveSubscription | undefined)
      | ActiveSubscription
      | undefined
  ) => void;
  setActiveInvoice: (
    activeInvoice:
      | ((
          activeInvoice: ActiveInvoice | undefined
        ) => ActiveInvoice | undefined)
      | ActiveInvoice
      | undefined
  ) => void;
}

const useStore = create<States & Actions>((set) => ({
  user: undefined,
  payments: undefined,
  subscriptionPlans: undefined,
  toDoLists: undefined,
  prayers: undefined,
  prayerStatistic: undefined,
  subsDuration: "",
  activeSubscription: undefined,
  activeInvoice: undefined,
  setUser: (user) => {
    set((state) => {
      if (typeof user === "function") {
        return { user: user(state.user) };
      }
      return { user };
    });
  },
  setPayments: (payments) => {
    set((state) => {
      if (typeof payments === "function") {
        return { payments: payments(state.payments) };
      }
      return { payments };
    });
  },
  setSubscriptionPlans: (subscriptionPlans) => {
    set((state) => {
      if (typeof subscriptionPlans === "function") {
        return {
          subscriptionPlans: subscriptionPlans(state.subscriptionPlans),
        };
      }
      return { subscriptionPlans };
    });
  },
  setToDoLists: (toDoLists) => {
    set((state) => {
      if (typeof toDoLists === "function") {
        return {
          toDoLists: toDoLists(state.toDoLists),
        };
      }
      return { toDoLists };
    });
  },
  setPrayers: (prayers) => {
    set((state) => {
      if (typeof prayers === "function") {
        return {
          prayers: prayers(state.prayers),
        };
      }
      return { prayers };
    });
  },
  setPrayerStatistic: (prayerStatistic) => {
    set((state) => {
      if (typeof prayerStatistic === "function") {
        return {
          prayerStatistic: prayerStatistic(state.prayerStatistic),
        };
      }
      return { prayerStatistic };
    });
  },
  setSubsDuration: (subsDuration) => {
    set(() => {
      return { subsDuration };
    });
  },
  setActiveSubscription: (activeSubscription) => {
    set((state) => {
      if (typeof activeSubscription === "function") {
        return {
          activeSubscription: activeSubscription(state.activeSubscription),
        };
      }
      return { activeSubscription };
    });
  },
  setActiveInvoice: (activeInvoice) => {
    set((state) => {
      if (typeof activeInvoice === "function") {
        return {
          activeInvoice: activeInvoice(state.activeInvoice),
        };
      }
      return { activeInvoice };
    });
  },
}));

export { useStore };
export type {
  User,
  PaymentStatus,
  SubscriptionPlan,
  SubscriptionPlanMap,
  ToDoList,
  Prayer,
  PrayerStatus,
  PrayerStatistic,
  PrayerName,
  ActiveSubscription,
  ActiveInvoice,
  Payment,
};
