'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';
import Image from 'next/image';

interface QRCodeWithDesignProps {
  registrationCode: string;
  teamData: {
    teamName: string;
    captainName: string;
    players: string[];
    paymentMethod: string;
    paymentRef: string;
  };
  tournamentName: string;
  tournamentDate: string;
}

export default function QRCodeWithDesign({ 
  registrationCode, 
  teamData, 
  tournamentName, 
  tournamentDate 
}: QRCodeWithDesignProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  const qrContent = JSON.stringify({
    code: registrationCode,
    team: teamData.teamName,
    captain: teamData.captainName,
    players: teamData.players,
    payment: teamData.paymentRef,
    tournament: tournamentName
  });

  const loadLogo = useCallback(async (): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      if (logoRef.current) {
        resolve(logoRef.current);
        return;
      }
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.src = '/logo.png';
      img.onload = () => {
        logoRef.current = img;
        resolve(img);
      };
      img.onerror = () => resolve(null);
    });
  }, []);

  const truncateText = (text: string, maxWidth: number, ctx: CanvasRenderingContext2D): string => {
    if (!text) return '—';
    const displayText = String(text);
    if (ctx.measureText(displayText).width <= maxWidth) return displayText;
    
    let truncated = displayText;
    while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + '...';
  };

  const generateQRWithDesign = useCallback(async () => {
    const qrBuffer = await QRCode.toDataURL(qrContent, {
      width: 150,
      margin: 2,
      color: {
        dark: '#1e1e2f',
        light: '#ffffff'
      }
    });

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    try {
      const logo = await loadLogo();
      if (logo) {
        ctx.drawImage(logo, 30, 25, 50, 50);
      }
    } catch {
      console.log('Logo non chargé');
    }

    ctx.font = 'bold 22px "Helvetica Neue", "Arial", sans-serif';
    ctx.fillStyle = '#1e1e2f';
      ctx.fillText('MDG Unity Gaming', 100, 55);
      

    ctx.font = '10px monospace';
    ctx.fillStyle = '#cccccc';
    ctx.fillText(registrationCode, 600, 45);

    ctx.font = 'bold 20px "Helvetica Neue", "Arial", sans-serif';
    ctx.fillStyle = '#1e1e2f';
    ctx.fillText(tournamentName, 100, 100);

    ctx.font = '12px "Helvetica Neue", "Arial", sans-serif';
    ctx.fillStyle = '#f8c741';
    ctx.fillText(tournamentDate, 550, 100);

    const qrImage = document.createElement('img');
    qrImage.src = qrBuffer;
    await new Promise<void>((resolve) => {
      qrImage.onload = () => resolve();
    });

    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(550, 130, 200, 200);
    ctx.drawImage(qrImage, 570, 150, 160, 160);

    ctx.font = 'bold 16px "Helvetica Neue", "Arial", sans-serif';
    ctx.fillStyle = '#1e1e2f';
    ctx.fillText('INFORMATIONS ÉQUIPE', 30, 180);

    ctx.fillStyle = '#f8f9fa';
    ctx.beginPath();
    ctx.roundRect(30, 200, 450, 320, 12);
    ctx.fill();
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(30, 200, 450, 320, 12);
    ctx.stroke();

    let yOffset = 240;

    ctx.font = 'bold 13px "Helvetica Neue", "Arial", sans-serif';
    ctx.fillStyle = '#495057';
    ctx.fillText('Équipe', 50, yOffset);
    ctx.font = '13px "Helvetica Neue", "Arial", sans-serif';
    ctx.fillStyle = '#212529';
    ctx.fillText(truncateText(teamData.teamName, 250, ctx), 160, yOffset);
    yOffset += 30;

    ctx.font = 'bold 13px "Helvetica Neue", "Arial", sans-serif';
    ctx.fillStyle = '#495057';
    ctx.fillText('Capitaine', 50, yOffset);
    ctx.font = '13px "Helvetica Neue", "Arial", sans-serif';
    ctx.fillStyle = '#212529';
    ctx.fillText(truncateText(teamData.captainName, 250, ctx), 160, yOffset);
    yOffset += 30;

    ctx.font = 'bold 13px "Helvetica Neue", "Arial", sans-serif';
    ctx.fillStyle = '#495057';
    ctx.fillText('Joueurs', 50, yOffset);
    yOffset += 20;

    const activePlayers = teamData.players.filter(p => p && String(p).trim() !== '');
    
    for (let i = 0; i < Math.min(4, activePlayers.length); i++) {
      ctx.font = '12px "Helvetica Neue", "Arial", sans-serif';
      ctx.fillStyle = '#212529';
      ctx.fillText(`👤 ${truncateText(activePlayers[i], 300, ctx)}`, 70, yOffset);
      yOffset += 20;
    }

    if (activePlayers.length > 4) {
      ctx.font = 'bold 12px "Helvetica Neue", "Arial", sans-serif';
      ctx.fillStyle = '#6c757d';
      ctx.fillText('Remplaçants:', 70, yOffset);
      yOffset += 16;

      for (let i = 4; i < activePlayers.length; i++) {
        ctx.font = '11px "Helvetica Neue", "Arial", sans-serif';
        ctx.fillStyle = '#6c757d';
        ctx.fillText(`  ↳ ${truncateText(activePlayers[i], 300, ctx)}`, 85, yOffset);
        yOffset += 16;
      }
    }

    yOffset += 5;

    ctx.font = 'bold 13px "Helvetica Neue", "Arial", sans-serif';
    ctx.fillStyle = '#495057';
    ctx.fillText('Paiement', 50, yOffset);
    
    ctx.font = '12px "Helvetica Neue", "Arial", sans-serif';
    ctx.fillStyle = '#2b8c3e';
    ctx.fillText(truncateText(teamData.paymentMethod, 100, ctx), 160, yOffset);
    
    ctx.font = '11px monospace';
    ctx.fillStyle = '#495057';
    ctx.fillText(truncateText(teamData.paymentRef, 120, ctx), 270, yOffset);

    ctx.font = '9px "Helvetica Neue", "Arial", sans-serif';
    ctx.fillStyle = '#adb5bd';
    ctx.fillText('Document personnel - Non transférable', 30, 530);

    ctx.fillStyle = '#f8c741';
    ctx.beginPath();
    ctx.roundRect(30, 570, 740, 60, 30);
    ctx.fill();

    ctx.font = 'bold 20px "Helvetica Neue", "Arial", sans-serif';
    ctx.fillStyle = '#1e1e2f';
    ctx.fillText('FINALE PRÉSENTIELLE', 80, 610);
    
    ctx.font = '14px "Helvetica Neue", "Arial", sans-serif';
    ctx.fillStyle = '#1e1e2f';
    ctx.fillText('29 MARS 2026 • BAEC ANKADIVATO', 420, 610);

    ctx.font = '8px "Helvetica Neue", "Arial", sans-serif';
    ctx.fillStyle = '#ced4da';
    ctx.fillText('Created by Dalia', 30, 670);
    ctx.fillText(new Date().toLocaleDateString('fr-FR'), 650, 670);

    setQrDataUrl(canvas.toDataURL('image/png'));
  }, [qrContent, registrationCode, teamData, tournamentName, tournamentDate, loadLogo]);

  useEffect(() => {
    generateQRWithDesign();
  }, [generateQRWithDesign]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `coupon-${teamData.teamName || 'equipe'}-${registrationCode}.png`;
    link.click();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {qrDataUrl && (
        <div className="space-y-4">
          <div className="bg-linear-to-br from-gray-50 to-white rounded-lg p-4 flex justify-center border border-gray-200">
            <Image
              src={qrDataUrl}
              alt="Coupon d'inscription"
              width={700}
              height={700}
              className="w-full max-w-2xl h-auto rounded shadow-sm aspect-square"
              unoptimized={true}
            />
          </div>
          
          <button
            onClick={handleDownload}
            className="w-full py-3.5 bg-linear-to-r from-[#f8c741] to-[#f9d164] rounded-xl flex items-center justify-center gap-2 font-semibold text-[#1e1e2f] shadow-md hover:shadow-lg transition-all hover:scale-[1.02] border border-[#e5b53a]"
          >
            <Download size={18} />
            TÉLÉCHARGER LE COUPON
          </button>
        </div>
      )}
    </div>
  );
}

declare global {
  interface CanvasRenderingContext2D {
    roundRect: (x: number, y: number, w: number, h: number, r: number) => void;
  }
}

if (typeof window !== "undefined") {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    return this;
  };
}