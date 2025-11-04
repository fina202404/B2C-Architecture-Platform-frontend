'use client';

import dynamic from 'next/dynamic';

const ThreeHero = dynamic(() => import('./ThreeHeroImpl'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[320px] md:h-[400px] bg-white border border-borderSoft shadow-card rounded-xl2 flex items-center justify-center text-textSecondary text-xs uppercase tracking-wide">
      Loading 3D Preview...
    </div>
  ),
});

export default ThreeHero;
