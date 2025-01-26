import Image from 'next/image';

export default function AvatarShowcase() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F3F4F5]">
      <div className="relative">
        <button
          className="avatar-trail flex items-center justify-center w-10 h-10 rounded-[12px] text-sm font-medium transition-colors duration-100 relative bg-white outline outline-0.5 outline-gray-200 shadow-sm hover:text-gray-700"
        >
          <Image 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="User avatar" 
            width={24}
            height={24}
            className="rounded-full z-[2]"
          />
        </button>
        <div 
          className="absolute -top-5 -right-12 px-2 py-1 text-xs font-medium text-white bg-[#3B82F6] rounded-full opacity-0 transition-opacity duration-200 pointer-events-none z-[3] flex items-center gap-1.5 whitespace-nowrap shadow-[0_1px_2px_rgba(59,130,246,0.12),0_2px_2px_rgba(59,130,246,0.08),0_0_15px_rgba(59,130,246,0.4),inset_0_-0.5px_0_0_rgba(0,0,0,0.08),inset_0_0.5px_0_0_rgba(255,255,255,0.5)]" 
          style={{ 
            background: 'linear-gradient(to bottom, #4F94FF 0%, #3B82F6 100%)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <span className="tracking-[-0.01em] relative top-[0.5px]">Coming Soon</span>
        </div>
      </div>
    </div>
  );
} 