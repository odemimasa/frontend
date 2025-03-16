import { Mail } from "@components/Icons/Mail";
import { WhatsApp } from "@components/Icons/WhatsApp";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { Link } from "react-router";

function HomePageView() {
  return (
    <>
      <div className="bg-[url('https://ec3q29jlfx8dke21.public.blob.vercel-storage.com/hero-OlNNIpWiRVqYVPZVfSeoTdSNzjRqBh.jpg')] h-screen bg-cover bg-center">
        <div className="relative z-10 h-full flex flex-col justify-center items-center mx-6">
          <h1 className="text-white font-bold text-center text-4xl ">
            Mengingatkan Ibadah, Mengingatkan Kebaikan
          </h1>
        </div>
      </div>

      {/* Visi Misi */}
      <div className="my-32 mx-6">
        <article className="text-center">
          <h2 className="text-[#61412D] font-bold text-4xl mb-6">Visi</h2>
          <p className="text-[#363636]">
            Menjadikan digitalisasi dalam kepekaan beribadah di setiap kesibukan
            apapun.
          </p>
        </article>

        <hr className="border-[#C2C2C2] my-12" />

        <article className="text-center">
          <h2 className="text-[#61412D] font-bold text-4xl mb-6">Misi</h2>
          <p className="text-[#363636]">
            Mewujudkan kepekaan dalam beribadah dengan digitalisasi demi
            tercapainya kehidupan yang lebih bermakna. Membawa perubahan bahwa
            ibadah perlu disimak dan direfleksikan secara nyata melalui
            digitalisasi.
          </p>
        </article>
      </div>

      {/* Surah */}
      <article className="my-32 mx-6 flex flex-col justify-center items-center">
        <img
          src="https://ec3q29jlfx8dke21.public.blob.vercel-storage.com/surah-UgQZqpwmfjmaCr8M0bcGBEdEKdNMIg.png"
          alt="Surah Al-'Asr"
          className="mb-8"
        />
        <p className="text-[#363636] font-medium text-center text-lg mb-3">
          (1) Demi masa, (2) sungguh, manusia berada dalam kerugian, (3) kecuali
          orang-orang yang beriman dan mengerjakan kebajikan serta saling
          menasihati untuk kebenaran dan saling menasihati untuk kesabaran.
        </p>
        <span className="text-[#7B7B7B] italic text-sm">
          QS. Al-'Asr ayat 1-3
        </span>
      </article>

      {/* Article */}
      <article className="my-32 mx-6">
        <img
          src="https://ec3q29jlfx8dke21.public.blob.vercel-storage.com/article-image-Io4gZrGOHdfLF3Eq5UqTEB2r5el43D.jpg"
          alt="Gambar Masjid"
          className="w-full h-48 object-cover object-center rounded-2xl mb-8"
        />

        <h2 className="text-[#2F3D4A] font-bold text-4xl mb-8">
          Kebaikan, Ketakwaan, dan Keridaan
        </h2>

        <p className="text-[#7B7B7B] mb-4">
          Mari mengingat kembali, dalam sebulan ada berapa banyak biaya untuk
          kebutuhan hiburan, lifestyle, ataupun hal-hal lainnya? Pada situasi
          ini,&nbsp;
          <strong className="font-bold">Demi Masa</strong> ingin mengambil peran
          di masyarakat untuk mengingatkan kepada sesama agar tidak tenggelam
          atau luput dalam menjaga kemajuan ibadahnya.
        </p>

        <p className="text-[#7B7B7B] mb-4">
          Oleh karena itu, kami memberikan visualisasi bagi individu yang telah
          beribadah agar menjadi laporan bagi dirinya sendiri, seberapa dekat
          atau jauh kepada Tuhan Yang Maha Esa. Kami percaya bahwa berinvestasi
          terhadap peningkatan ibadah merupakan bentuk kebaikan, utamanya dalam
          mengingatkan kebaikan.
        </p>

        <p className="text-[#7B7B7B] mb-4">
          Namun, <strong className="font-bold">Demi Masa</strong> ingin
          mengingatkan bahwa perbuatan&nbsp;
          <a
            href="https://kbbi.kemdikbud.go.id/entri/ria%20(2)"
            target="_blank"
            rel="noopener"
            className="text-blue-600 italic underline"
          >
            ria
          </a>
          &nbsp;sangat merugikan bagi individu. Oleh karena itu, penggunakan
          fasilitas <strong className="font-bold">Demi Masa</strong> diharapkan
          dapat digunakan dengan bijaksana dan dengan niat ibadah yang bersih.
        </p>
      </article>

      {/* Footer */}
      <div className="bg-black py-12 px-6">
        <div className="flex justify-center items-center gap-4 mb-12">
          <img
            src="https://ec3q29jlfx8dke21.public.blob.vercel-storage.com/demi-masa-logo-hqkMxwY4lciC0StHA05IUeeWvw3jfq.png"
            alt="Logo Aplikasi Demi Masa"
            className="w-12"
          />

          <h3 className="text-white font-bold text-xl">Demi Masa</h3>
        </div>

        <h3 className="text-white font-bold text-lg mb-2">Hubungi Kami</h3>
        <ul className="flex flex-col">
          <li>
            <Link
              to="mailto:demimasa@gmail.com"
              className="text-[#C2C2C2] text-sm flex items-center gap-3 py-2 hover:underline"
            >
              <Mail className="fill-[#C2C2C2] w-5 h-5" />
              demimasa@gmail.com
            </Link>
          </li>
          <li>
            <Link
              to="https://wa.me/6282349235756"
              target="_blank"
              rel="noopener"
              className="text-[#C2C2C2] text-sm flex items-center gap-3 py-2 hover:underline"
            >
              <WhatsApp className="fill-[#C2C2C2] w-5 h-5" />
              wa.me/082349235756
            </Link>
          </li>
          <li>
            <Link
              to="https://www.instagram.com/"
              target="_blank"
              rel="noopener"
              className="text-[#C2C2C2] text-sm flex items-center gap-3 py-2 hover:underline"
            >
              <InstagramLogoIcon className="text-[#C2C2C2] w-5 h-5" />
              instagram.com/demimasa
            </Link>
          </li>
        </ul>

        <hr className="border-white my-8" />
        <p className="text-white text-center">
          &copy; {new Date().getFullYear()} Demi Masa. All Rights Reserved
        </p>
      </div>
    </>
  );
}

export { HomePageView };
