export default function Guest({ children }) {
  return (
    <div className="min-h-[100dvh] bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-[390px]">
        {/* タイトル（Tastie） */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-main">pureat</h1>
        </div>

        {/* カード枠 */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
