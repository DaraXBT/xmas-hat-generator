import React, { useState, useEffect } from 'react';
import { Hat } from '../types';

interface HatSelectorProps {
  onSelect: (hat: Hat) => void;
  selectedHatId?: string;
}

const HatSelector: React.FC<HatSelectorProps> = ({ onSelect, selectedHatId }) => {
  const [localHats, setLocalHats] = useState<Hat[]>([]);

  // Only use dynamically loaded local hats
  const allHats = localHats;

  useEffect(() => {
    let active = true;
    const maxIndex = 30; // 尝试并行加载前 30 张图片

    const loadHat = (index: number) => {
      const img = new Image();
      // 使用绝对路径 /hats/ 确保在任何路由下都能正确访问 public 目录
      const src = `/hats/${index}.png`;
      
      img.onload = () => {
        if (!active) return;
        
        setLocalHats(prev => {
          // 避免重复添加
          if (prev.some(h => h.src === src)) return prev;
          
          const newHat = { id: `local-${index}`, name: `款式 ${index}`, src };
          const newList = [...prev, newHat];
          
          // 保持按数字顺序排序
          return newList.sort((a, b) => {
            const getNum = (str: string) => parseInt(str.split('-')[1] || '0');
            return getNum(a.id) - getNum(b.id);
          });
        });
      };

      // 并行加载时，单个失败不影响其他
      img.onerror = () => {
        // console.log(`Failed to load ${src}`);
      };

      img.src = src;
    };

    // 并行发起请求，不再依赖递归
    for (let i = 1; i <= maxIndex; i++) {
      loadHat(i);
    }

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      {allHats.length === 0 && (
         <div className="col-span-4 text-center text-[#86868b] text-sm py-8 bg-white rounded-2xl border border-dashed border-[#d2d2d7]">
            正在加载素材...
         </div>
      )}
      {allHats.map((hat) => (
        <button
          key={hat.id}
          onClick={() => onSelect(hat)}
          className={`
            relative p-3 rounded-2xl transition-all duration-300 aspect-square flex items-center justify-center bg-white shadow-sm overflow-hidden border
            ${selectedHatId === hat.id 
              ? 'ring-2 ring-[#0071e3] border-[#0071e3] scale-105 z-10' 
              : 'border-transparent hover:border-[#d2d2d7] hover:scale-105 hover:shadow-md'}
          `}
        >
          <img 
            src={hat.src} 
            alt={hat.name} 
            className="w-full h-full object-contain pointer-events-none select-none" 
          />
        </button>
      ))}
    </div>
  );
};

export default HatSelector;