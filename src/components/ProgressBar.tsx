interface ProgressBarProps {
  value: number;
}

export default function ProgressBar({ value }: ProgressBarProps) {
const getColor = (val: number) => {
  if (val >= 99) return "bg-blue-600";      // Azul
  if (val >= 75) return "bg-cyan-500";      // Cian
  if (val >= 60) return "bg-green-500";     // Verde
  if (val >= 45) return "bg-lime-400";      // Verde lima
  if (val >= 30) return "bg-yellow-400";    // Amarillo
  if (val >= 15) return "bg-orange-400";    // Naranja
  return "bg-red-600";                      // Rojo
};

  return (
    <div className="w-full py-1"> {/* Aumentamos altura vertical */}
      <div className="w-full h-2 border-[1px] border-white bg-gray-200 rounded">
        <div
          className={`h-1.5 rounded transition-all duration-500 ${getColor(value)}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <div className="text-center text-[13px] mt-[3px] font-semibold text-[#2a4d50]">
        {value}%
      </div>
    </div>
  );
}
