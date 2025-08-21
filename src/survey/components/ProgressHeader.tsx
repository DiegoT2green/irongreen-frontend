type Props = {
  current: number;
  total: number;
};

export default function ProgressHeader({ current, total }: Props) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="fixed bottom-0 left-64 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-300 shadow-inner px-6 py-3">
      <p className="text-sm font-medium text-gray-700 mb-1">
        Progresso: {percent}%
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
