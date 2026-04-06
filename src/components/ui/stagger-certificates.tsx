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

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-6 transition-all duration-500 ease-in-out",
        isCenter 
          ? "z-10 bg-[#f5f0e6] text-[#1a1a1a] border-[#d4c8b0]" 
          : "z-0 bg-[#faf8f3] text-[#4a4a4a] border-[#e8e0d0] hover:border-[#d4c8b0]/50"
      )}
      style={{
        width: cardSize,
        height: cardSize * 1.2,
        clipPath: `polygon(40px 0%, calc(100% - 40px) 0%, 100% 40px, 100% 100%, calc(100% - 40px) 100%, 40px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -50 : position % 2 ? 12 : -12}px)
          rotate(${isCenter ? 0 : position % 2 ? 2 : -2}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px rgba(212, 200, 176, 0.5)" : "0px 0px 0px 0px transparent"
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
        className="relative mb-4 w-full aspect-[1.4/1] overflow-hidden bg-[#e8e0d0]"
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
        "text-sm sm:text-base font-medium leading-tight mb-2 line-clamp-2",
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
  const [cardSize, setCardSize] = useState(340);
  // Duplicate certificates 3x to create seamless infinite effect
  const [certificatesList, setCertificatesList] = useState(() => {
    const duplicated = [...certificates, ...certificates, ...certificates].map((cert, i) => ({
      ...cert,
      id: `${cert.id}-${i}`
    }));
    return duplicated;
  });

  const handleMove = (steps: number) => {
    const newList = [...certificatesList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push(item);
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift(item);
      }
    }
    setCertificatesList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 340 : 280);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height: 520 }}
    >
      {certificatesList.map((certificate, index) => {
        const position = certificatesList.length % 2
          ? index - (certificatesList.length + 1) / 2
          : index - certificatesList.length / 2;
        return (
          <CertificateCard
            key={certificate.id}
            certificate={certificate}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      
      {/* Navigation Buttons */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center text-xl transition-colors",
            "bg-[#faf8f3] border-2 border-[#e8e0d0] hover:bg-[#f5f0e6] hover:text-[#1a1a1a]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4c8b0] focus-visible:ring-offset-2"
          )}
          aria-label="Previous certificate"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center text-xl transition-colors",
            "bg-[#faf8f3] border-2 border-[#e8e0d0] hover:bg-[#f5f0e6] hover:text-[#1a1a1a]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4c8b0] focus-visible:ring-offset-2"
          )}
          aria-label="Next certificate"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
