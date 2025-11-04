
export default function ResetPage(){
  return (
    <main className="px-6 py-24 max-w-md mx-auto text-textPrimary">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Password recovery</h1>
      <p className="text-sm text-textSecondary leading-relaxed">
        Enter your email and we will send reset instructions.
      </p>
      <input className="bg-white text-black placeholder-gray-500 p-3 rounded border border-borderSoft text-sm mt-4 w-full focus:outline-none focus:ring-2 focus:ring-accentGold focus:border-accentGold" placeholder="Email"/>
      <button className="bg-textPrimary text-white py-3 text-sm font-semibold tracking-wide uppercase w-full mt-4">
        Send reset link
      </button>
    </main>
  );
}
