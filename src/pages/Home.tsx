import { Article } from "@components/Home/Article";
import { Footer } from "@components/Home/Footer";
import { LoginAndRegister } from "@components/Home/LoginAndRegister";
import { PricingPlan } from "@components/Home/PricingPlan";
import { Surah } from "@components/Home/Surah";
import { VisiMisi } from "@components/Home/VisiMisi";

export default function Home(): JSX.Element {
  return (
    <>
      <div className="bg-[url('https://ec3q29jlfx8dke21.public.blob.vercel-storage.com/hero-OlNNIpWiRVqYVPZVfSeoTdSNzjRqBh.jpg')] h-screen bg-cover bg-center">
        <div className="relative z-10 h-full flex flex-col justify-center items-center mx-6">
          <h1 className="text-white font-bold text-center text-4xl ">
            Mengingatkan Ibadah, Mengingatkan Kebaikan
          </h1>
        </div>
      </div>

      <VisiMisi />
      <PricingPlan />
      <Surah />
      <Article />
      <LoginAndRegister />
      <Footer />
    </>
  );
}
