import Image from 'next/image';
import Vetrina from "@/app/components/Vetrina";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-centers">
      <h1 className="flex justify-center items-center mt-8">
        <Image
          src="/images/titolo.png"
          alt="netflix-font"
          width={300}
          height={100}
        />
      </h1>
      <Vetrina />
    </div>
  );
}
