type Props = {
  visitCount: number;
};

export function VisitCounter({ visitCount }: Props) {
  const paddingZeros = "0".repeat(6 - visitCount.toString().length);
  const digits = `${paddingZeros}${visitCount}`;

  return (
    <div className="flex flex-row gap-px">
      {digits.split("").map((digit, index) => (
        <div
          key={index}
          className="bg-gradient-to-t from-stone-900 to-stone-950 py-[2px] px-[4px] text-gray-50"
        >
          {digit}
        </div>
      ))}
    </div>
  );
}
