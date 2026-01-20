import Link from "next/link";
import Img from "next/image";
import receiptSVG from "../../../public/receipt-alt-svgrepo-com.svg";

export default function UserMenuOrder() {
  return (
    <Link
      href="/orders"
      className="relative flex flex-row gap-2 items-center hover:cursor-pointer hover:underline px-3 py-2 text-md"
      title="Check Order History"
    >
      Order History
        <Img src={receiptSVG} alt="Order History Logo" width={25} height={25} />
    </Link>
  );
}
