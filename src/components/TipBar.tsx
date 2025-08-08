import React, { useMemo } from "react";
import { useData } from "../context/DataContext"; // ajuste le chemin si besoin

type ActiveTip = {
  challengeId: string;
  tip_txt: string;
  heure_reveal: string; // ISO
  heure_fin: string;    // ISO
};

type TipBarProps = {
  /** Optionnel : n’afficher que les tips d’un challenge donné */
  challengeId?: string;
  /** Optionnel : intervalle de rafraîchissement en ms (défaut: 30s) */
  refreshMs?: number;
};

/**
 * <TipBar />
 * - Affiche un bandeau rouge, fixé en haut de page, avec "Indices : " statique
 * - Les tips actifs (fournis par le backend /api/tips via DataContext) défilent vers la gauche
 * - Masqué automatiquement si aucun tip actif
 * - Respecte le suspenseMode (si true -> pas d’affichage)
 */
const TipBar: React.FC<TipBarProps> = () => {
  const { suspenseMode, activeTips } = useData();

  // Texte à défiler : on concatène les tips actifs
  const marqueeText = useMemo(() => {
    if (!activeTips?.length) return "";
    // Exemple : [ "Indice A", "Indice B", "Indice C" ] -> "Indice A  •  Indice B  •  Indice C"
    return activeTips.map((t) => (t.tip_txt || "").trim()).filter(Boolean).join("   •   ");
  }, [activeTips]);

  // Rien à afficher si:
  // - mode suspens actif
  // - pas de tips actifs
  if (suspenseMode || !marqueeText) {
    return null;
  }

  // Pour un défilement continu, on duplique la ligne
  const duplicated = `${marqueeText}     ${marqueeText}`;

  return (
    <>
      <div style={wrapperStyle} role="status" aria-live="polite">
        <div style={labelStyle}>Indices :</div>
        <div style={viewportStyle}>
          <div style={trackStyle} className="tipbar-track">
            <span style={textStyle}>{duplicated}</span>
          </div>
        </div>
      </div>

      {/* Styles d’animation (keyframes) */}
      <style>{`
        @keyframes tipbar-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .tipbar-track {
          display: inline-block;
          white-space: nowrap;
          will-change: transform;
          animation: tipbar-marquee 20s linear infinite;
        }
        @media (max-width: 768px) {
          .tipbar-track { animation-duration: 28s; }
        }
      `}</style>
    </>
  );
};

export default TipBar;

/* ========== Styles inline simples ========== */
const wrapperStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,                // bandeau en haut de page
  left: 0,
  right: 0,
  height: 40,
  background: "#D32F2F", // rouge
  color: "#fff",
  display: "flex",
  alignItems: "center",
  padding: "0 12px",
  gap: 12,
  zIndex: 9999,
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  fontSize: 14,
};

const labelStyle: React.CSSProperties = {
  fontWeight: 700,
  flex: "0 0 auto",
};

const viewportStyle: React.CSSProperties = {
  overflow: "hidden",
  flex: "1 1 auto",
  height: "100%",
  display: "flex",
  alignItems: "center",
};

const trackStyle: React.CSSProperties = {
  display: "inline-block",
};

const textStyle: React.CSSProperties = {
  display: "inline-block",
  paddingLeft: 8,
};
