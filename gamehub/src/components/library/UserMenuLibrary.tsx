import Link from "next/link";
import Img from "next/image";
import receiptSVG from "../../../public//library-svgrepo-com.svg";

export default function UserMenuLibrary() {
  return (
    <Link
      href="/library"
      className="relative flex flex-row gap-2 items-center hover:cursor-pointer hover:underline px-3 py-2 text-md"
      title="Check Your Library"
    >
      Your Library
        <Img src={receiptSVG} alt="Library Logo" width={25} height={25} />
    </Link>
  );
}