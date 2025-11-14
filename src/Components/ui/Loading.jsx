import { Loader } from "lucide-react";

export default function Loading({ label, labelClassName = "" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-center">
      <Loader className="animate-spin text-blue-400" />
      {label && <p className={labelClassName}>{label}</p>}
    </div>
  );
}
