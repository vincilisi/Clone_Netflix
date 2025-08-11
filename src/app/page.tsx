import Image from "next/image";
import Vetrina from "@/app/components/Vetrina";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="flex justify-center items-center mt-8">
        <img
          src="https://fontmeme.com/permalink/250811/0ddacad13ba92d0cff1722d56954dcfe.png"
          alt="netflix-font"
        />
      </h1>
      <div className="mt-6 bg-red-300 p-4">
        <Vetrina />
      </div>
    </div>
  );
}
