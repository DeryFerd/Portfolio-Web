"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const SQRT_5000 = Math.sqrt(5000);

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  image: string;
}

interface CertificateCardProps {
  position: number;
  certificate: CertificateItem;
  handleMove: (steps: number) => void;
  cardSize: number;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ 
  position, 
  certificate, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;
  const distanceFromCenter = Math.abs(position);
  const zIndex = 20 - distanceFromCenter; // Center = 20, sides decrease

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-6 transition-all duration-500 ease-in-out",
        isCenter 
          ? "bg-[#f5f0e6] text-[#1a1a1a] border-[#d4c8b0]" 
          : "bg-[#faf8f3] text-[#4a4a4a] border-[#e8e0d0] hover:border-[#d4c8b0]/50"
      )}
      style={{
        width: cardSize,
        height: cardSize * 1.15,
        zIndex,
        clipPath: `polygon(40px 0%, calc(100% - 40px) 0%, 100% 40px, 100% 100%, calc(100% - 40px) 100%, 40px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.6) * position}px)
          translateY(${isCenter ? -40 : position % 2 ? 12 : -12}px)
          rotate(${isCenter ? 0 : position % 2 ? 2 : -2}deg)
          scale(${isCenter ? 1 : 0.95})
        `,
        boxShadow: isCenter 
          ? "0px 8px 0px 4px rgba(212, 200, 176, 0.5), 0 20px 40px rgba(0, 0, 0, 0.15)" 
          : `${position > 0 ? '-' : ''}${distanceFromCenter * 2}px ${distanceFromCenter * 4}px ${distanceFromCenter * 6}px rgba(0, 0, 0, ${0.1 - distanceFromCenter * 0.02})`
      }}
    >
      {/* Corner ribbon effect */}
      <span
        className="absolute block origin-top-right rotate-45 bg-[#e8e0d0]"
        style={{
          right: -2,
          top: 38,
          width: SQRT_5000,
          height: 2
        }}
      />
      
      {/* Certificate Image */}
      <div 
        className="relative mb-4 w-full aspect-[1.4/1] overflow-hidden"
        style={{
          boxShadow: "3px 3px 0px rgba(250, 248, 243, 1)"
        }}
      >
        <Image
          src={certificate.image}
          alt={certificate.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      
      {/* Title */}
      <h3 className={cn(
        "text-sm sm:text-base font-medium leading-tight mb-2",
        isCenter ? "text-[#1a1a1a]" : "text-[#4a4a4a]"
      )}>
        {certificate.title}
      </h3>
      
      {/* Meta info */}
      <div className={cn(
        "absolute bottom-6 left-6 right-6",
        isCenter ? "text-[#1a1a1a]/70" : "text-[#6a6a6a]"
      )}>
        <p className="text-xs font-medium uppercase tracking-wider">
          {certificate.issuer}
        </p>
        <p className="text-xs mt-1">
          {certificate.issuedAt}
        </p>
      </div>
    </div>
  );
};

interface StaggerCertificatesProps {
  certificates: CertificateItem[];
  className?: string;
}

export const StaggerCertificates: React.FC<StaggerCertificatesProps> = ({ 
  certificates,
  className
}) => {
  const [cardSize, setCardSize] = useState(300);
  const [certificatesList, setCertificatesList] = useState(certificates);

  const handleMove = (steps: number) => {
    const newList = [...certificatesList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, id: `${item.id}-${Math.random()}` });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, id: `${item.id}-${Math.random()}` });
      }
    }
    setCertificatesList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 300 : 240);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Only show certificates within visible range (-2 to +2 from center)
  const visibleCertificates = certificatesList.map((cert, index) => {
    const position = certificatesList.length % 2
      ? index - (certificatesList.length + 1) / 2
      : index - certificatesList.length / 2;
    return { cert, position, index };
  }).filter(({ position }) => Math.abs(position) <= 2);

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height: 480 }}
    >
      {visibleCertificates.map(({ cert, position, index }) => (
        <CertificateCard
          key={cert.id}
          certificate={cert}
          handleMove={handleMove}
          position={position}
          cardSize={cardSize}
        />
      ))}
      
      {/* Navigation Buttons */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center text-xl transition-all duration-200",
            "bg-[#faf8f3] border-2 border-[#e8e0d0] hover:bg-[#f5f0e6] hover:border-[#d4c8b0]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4c8b0] focus-visible:ring-offset-2"
          )}
          style={{
            clipPath: "polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% 100%, calc(100% - 8px) 100%, 8px 100%, 0 100%, 0 0)"
          }}
          aria-label="Previous certificate"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center text-xl transition-all duration-200",
            "bg-[#faf8f3] border-2 border-[#e8e0d0] hover:bg-[#f5f0e6] hover:border-[#d4c8b0]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4c8b0] focus-visible:ring-offset-2"
          )}
          style={{
            clipPath: "polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% 100%, calc(100% - 8px) 100%, 8px 100%, 0 100%, 0 0)"
          }}
          aria-label="Next certificate"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
