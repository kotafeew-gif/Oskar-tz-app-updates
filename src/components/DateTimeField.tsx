import { fieldClass } from "./fieldClasses";
import { getTodayLocalIso, getCurrentLocalTimeIso } from "../utils";

export default function DateTimeField({
  dateFieldName,
  timeFieldName,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  invalidDate,
  invalidTime,
}: {
  dateFieldName: string;
  timeFieldName: string;
  dateValue: string;
  timeValue: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  invalidDate: boolean;
  invalidTime: boolean;
}) {
  const todayIso = getTodayLocalIso();

  return (
    <div className="flex gap-2 w-full">
      <input
        data-field={dateFieldName}
        type="date"
        min={todayIso}
        className={`${fieldClass(invalidDate)} min-w-[150px] flex-1`}
        value={dateValue}
        onChange={(e) => onDateChange(e.target.value)}
      />
      <input
        data-field={timeFieldName}
        type="time"
        min={dateValue === todayIso ? getCurrentLocalTimeIso() : undefined}
        className={`${fieldClass(invalidTime)} w-32 min-w-0 shrink`}
        value={timeValue}
        onChange={(e) => onTimeChange(e.target.value)}
      />
    </div>
  );
}

