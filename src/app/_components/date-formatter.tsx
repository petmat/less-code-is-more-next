import { parseISO, format } from "date-fns";

type Props = {
  dateString: string;
};

const DateFormatter = ({ dateString }: Props) => {
  const date = parseISO(dateString);
  return (
    <time className="text-xs opacity-60" dateTime={dateString}>
      {format(date, "LLLL	d, yyyy")}
    </time>
  );
};

export default DateFormatter;
