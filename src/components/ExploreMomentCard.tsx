import { Moment } from "@/data/mockData";

export default function ExploreMomentCard({ moment, compact, onOpen }: { moment: Moment; compact?: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`${
        compact ? "w-[72%]" : "w-full"
      } shrink-0 overflow-hidden rounded-[22px] border border-white/10 bg-[#191920] text-left shadow-[0_14px_28px_rgba(0,0,0,0.24)] active:scale-[0.98]`}
    >
      <div className={`${compact ? "h-28" : "h-44"} relative overflow-hidden bg-[#223a9a]`}>
        {moment.imageUrl ? (
          <img src={moment.imageUrl} alt="" className="h-full w-full object-cover object-[52%_69%]" />
        ) : (
          <div className="h-full w-full bg-[#15151d]"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#16161d] via-transparent to-transparent" />
      </div>
      <div className="p-3.5">
        <p className="truncate text-[15px] font-extrabold text-white">{moment.title}</p>
        <p className="mt-1 truncate text-[12px] font-medium text-white/45">{moment.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[12px] font-bold text-lime">{moment.price} CHZ</span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/70">
            {moment.category}
          </span>
        </div>
      </div>
    </button>
  );
}
