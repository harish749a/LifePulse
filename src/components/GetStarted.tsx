import { Sparkles, Heart } from 'lucide-react';

interface GetStartedProps {
  onGetStarted: () => void;
  onLogIn: () => void;
}

export default function GetStarted({ onGetStarted, onLogIn }: GetStartedProps) {
  return (
    <div id="get-started-screen" className="flex flex-col min-h-screen bg-slate-50/50 justify-between p-6">
      {/* Top Section */}
      <div className="flex flex-col items-center mt-12 text-center">
        {/* Brand Logo Group */}
        <div className="flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-4 relative animate-pulse">
          <div className="absolute inset-0 bg-emerald-100 rounded-full scale-110 opacity-30 animate-ping"></div>
          {/* Leaf Logo representation */}
          <svg className="w-10 h-10 text-emerald-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3C7.5 3 3.5 7 3 11.5C2.5 16 6 20 10.5 20.5C11.5 20.6 12 21 12 21M12 3C16.5 3 20.5 7 21 11.5C21.5 16 18 20 13.5 20.5C12.5 20.6 12 21 12 21M12 3V21M12 11.5L7.5 7.5M12 14L16.5 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-sans mb-2">LifePulse</h1>
        <p className="text-gray-500 text-sm max-w-[240px]">
          Build better habits.<br />Live a better life.
        </p>
      </div>

      {/* Center Meditation Vector Graphic - Custom SVG */}
      <div className="flex justify-center my-6 relative">
        <div className="absolute -top-6 -left-6 text-emerald-300 animate-bounce">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute -bottom-2 right-4 text-pink-300 animate-pulse">
          <Heart className="w-5 h-5 fill-pink-300" />
        </div>
        
        <svg className="w-64 h-64 drop-shadow-sm" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background decorative leaf details */}
          <path d="M50,220 C30,170 50,110 90,130 C100,135 110,150 110,170 C110,190 90,210 50,220 Z" fill="#D1FAE5" opacity="0.6" />
          <path d="M250,220 C270,170 250,110 210,130 C200,135 190,150 190,170 C190,190 210,210 250,220 Z" fill="#D1FAE5" opacity="0.6" />
          <circle cx="150" cy="180" r="70" fill="#E6F4EA" />
          
          {/* Meditating girl vector */}
          {/* Legs folded */}
          <path d="M80,210 C100,180 130,180 150,200 C170,180 200,180 220,210 C230,220 220,230 200,230 C150,230 150,230 100,230 C80,230 70,220 80,210 Z" fill="#064E3B" />
          <path d="M95,215 C115,195 135,195 150,210 C165,195 185,195 205,215" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
          
          {/* Torso/Outfit */}
          <path d="M130,140 L170,140 L165,195 L135,195 Z" fill="#10B981" />
          <circle cx="150" cy="190" r="12" fill="#047857" />
          
          {/* Neck and Head */}
          <rect x="146" y="115" width="8" height="15" rx="3" fill="#FDBA74" />
          <circle cx="150" cy="105" r="18" fill="#FDBA74" />
          
          {/* Hair */}
          <path d="M132,102 C132,85 168,85 168,102 C168,110 162,118 150,118 C138,118 132,110 132,102 Z" fill="#1F2937" />
          <path d="M132,102 C125,115 125,140 135,150 C130,140 130,120 132,102 Z" fill="#1F2937" />
          <path d="M168,102 C175,115 175,140 165,150 C170,140 170,120 168,102 Z" fill="#1F2937" />

          {/* Arms/Hands meditating */}
          <path d="M130,145 C110,155 100,175 110,185 C115,190 125,185 125,180" stroke="#FDBA74" strokeWidth="5" strokeLinecap="round" />
          <path d="M170,145 C190,155 200,175 190,185 C185,190 175,185 175,180" stroke="#FDBA74" strokeWidth="5" strokeLinecap="round" />
          
          {/* Floating energy/breathe circles */}
          <circle cx="150" cy="105" r="28" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" className="animate-spin" style={{ transformOrigin: '150px 105px', animationDuration: '10s' }} />
          <circle cx="150" cy="105" r="38" stroke="#34D399" strokeWidth="1" strokeDasharray="6 6" opacity="0.4" className="animate-spin" style={{ transformOrigin: '150px 105px', animationDuration: '15s', animationDirection: 'reverse' }} />
        </svg>
      </div>

      {/* Bottom Interactive Area */}
      <div className="flex flex-col space-y-4 mb-4">
        <button
          id="btn-get-started-action"
          onClick={onGetStarted}
          className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-2xl shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-98 text-center cursor-pointer"
        >
          Get Started
        </button>
        
        <div className="text-center">
          <span className="text-gray-400 text-xs">Already have an account? </span>
          <button
            id="btn-goto-login"
            onClick={onLogIn}
            className="text-emerald-600 font-semibold text-xs hover:underline focus:outline-none cursor-pointer"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
