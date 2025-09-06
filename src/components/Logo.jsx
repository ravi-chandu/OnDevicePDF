import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 font-semibold text-slate-800">
      <img src="/favicon.svg" className="h-7 w-7" alt="OnDevicePDF logo"/>
      <span>OnDevicePDF</span>
    </Link>
  );
}
