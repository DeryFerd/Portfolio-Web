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
  issuedAt?: string;
  image: string;
}

interface CertificateCardProps {
  position: number;
  certificate: CertificateItem;
  handleMove: (steps: number) => void;
  onPreview?: (certificate: CertificateItem) => void;
  cardSize: number;
  isHidden?: boolean;
  isDarkTheme: boolean;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ 
  position, 
  certificate, 
  handleMove, 
  onPreview,
  cardSize,
  isHidden = false,
  isDarkTheme,
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => {
        if (isHidden) {
          return;
        }

        if (isCenter) {
          onPreview?.(certificate);
          return;
        }

        handleMove(position);
      }}
      className={cn(
        "absolute left-1/2 top-1/2 flex cursor-pointer flex-col border-2 p-6 transition-[transform,opacity,background-color,border-color,color,box-shadow] duration-200 ease-out",
        isHidden && "opacity-0 pointer-events-none",
        isDarkTheme
          ? isCenter
            ? "z-10 bg-[rgba(21,25,32,0.96)] text-[#e6edf7] border-[rgba(126,171,231,0.45)]"
            : "z-0 bg-[rgba(15,18,24,0.9)] text-[#bcc6d6] border-[rgba(126,171,231,0.2)] hover:border-[rgba(126,171,231,0.44)]"
          : isCenter
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
        boxShadow: isCenter
          ? isDarkTheme
            ? "0px 18px 36px rgba(0, 0, 0, 0.45), inset 0px 0px 0px 1px rgba(126, 171, 231, 0.22)"
            : "0px 8px 0px 4px rgba(212, 200, 176, 0.5)"
          : "0px 0px 0px 0px transparent",
      }}
    >
      {/* Corner ribbon effect */}
      <span
        className={cn(
          "absolute block origin-top-right rotate-45",
          isDarkTheme ? "bg-[rgba(126,171,231,0.35)]" : "bg-[#e8e0d0]",
        )}
        style={{
          right: -2,
          top: 38,
          width: SQRT_5000,
          height: 2
        }}
      />
      
      {/* Certificate Image */}
      <div 
        className={cn(
          "relative mb-4 w-full aspect-[1.4/1] overflow-hidden",
          isDarkTheme ? "bg-[rgba(126,171,231,0.14)]" : "bg-[#e8e0d0]",
        )}
        style={{
          boxShadow: isDarkTheme
            ? "3px 3px 0px rgba(17, 20, 27, 0.9)"
            : "3px 3px 0px rgba(250, 248, 243, 1)",
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
      <div className="flex flex-1 items-center justify-center px-3 pb-6 pt-2 text-center">
        <h3 className={cn(
          "max-w-[16ch] text-base font-medium leading-snug tracking-[-0.01em] sm:text-lg",
          isDarkTheme
            ? isCenter
              ? "text-[#ebf1fb]"
              : "text-[#c1c9d7]"
            : isCenter
              ? "text-[#1f1a14]"
              : "text-[#4a4a4a]",
        )}>
          {certificate.title}
        </h3>
      </div>
      
      {/* Meta info */}
      <div className={cn(
        "mt-auto border-t pt-4",
        isDarkTheme
          ? "border-[rgba(126,171,231,0.28)]"
          : "border-[#d9cfbc]/80",
        isDarkTheme
          ? isCenter
            ? "text-[#dbe6f7]/76"
            : "text-[#aab4c2]"
          : isCenter
            ? "text-[#1a1a1a]/70"
            : "text-[#6a6a6a]"
      )}>
        <p className="text-xs font-medium uppercase tracking-wider">
          {certificate.issuer}
        </p>
        {certificate.issuedAt ? (
          <p className="text-xs mt-1">
            {certificate.issuedAt}
          </p>
        ) : null}
      </div>
    </div>
  );
};

interface StaggerCertificatesProps {
  certificates: CertificateItem[];
  className?: string;
  onIndexChange?: (index: number) => void;
  onPreview?: (certificate: CertificateItem) => void;
}

export const StaggerCertificates: React.FC<StaggerCertificatesProps> = ({ 
  certificates,
  className,
  onIndexChange,
  onPreview,
}) => {
  const [cardSize, setCardSize] = useState(340);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
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
        newList.push({ ...item, id: `${item.id.split('-')[0]}-${Date.now()}-${Math.random()}` });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, id: `${item.id.split('-')[0]}-${Date.now()}-${Math.random()}` });
      }
    }
    setCertificatesList(newList);
    // Calculate new active index and notify parent
    const newIndex = (activeIndex + steps + certificates.length) % certificates.length;
    setActiveIndex(newIndex);
    onIndexChange?.(newIndex);
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

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => {
      setIsDarkTheme(root.getAttribute("data-theme") !== "light");
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
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
        // Hide cards beyond position -1 and +1 (keep in DOM for smooth loop)
        const isHidden = Math.abs(position) > 1;
        return (
          <CertificateCard
            key={certificate.id}
            certificate={certificate}
            handleMove={handleMove}
            onPreview={onPreview}
            position={position}
            cardSize={cardSize}
            isHidden={isHidden}
            isDarkTheme={isDarkTheme}
          />
        );
      })}
      
      {/* Navigation Buttons */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 p-1.5 rounded-full bg-background/40 backdrop-blur-md border border-border shadow-lg">
        <button
          onClick={() => handleMove(-1)}
          suppressHydrationWarning
          className={cn(
            "group flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-all duration-300",
            "text-muted-foreground hover:text-accent hover:bg-secondary/80 hover:shadow-md",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
          aria-label="Previous certificate"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-x-0.5" />
        </button>
        <button
          onClick={() => handleMove(1)}
          suppressHydrationWarning
          className={cn(
            "group flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-all duration-300",
            "text-muted-foreground hover:text-accent hover:bg-secondary/80 hover:shadow-md",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
          aria-label="Next certificate"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
