type Props = {
  visitCount: number;
};

export function VisitCounter({ visitCount }: Props) {
  const paddingZeros = "0".repeat(6 - visitCount.toString().length);
  const visitCountText = `${paddingZeros}${visitCount}`;

  return (
    <div className="flex flex-row gap-px">
      {visitCountText.split("").map((c) => (
        <div className="bg-gradient-to-t from-stone-800 to-stone-950 py-[2px] px-1 text-gray-50">
          {c}
        </div>
      ))}
    </div>
  );
}
