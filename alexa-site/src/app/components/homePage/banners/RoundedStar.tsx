import { useMemo, useId } from 'react';

interface RoundedStarProps {
  imageUrl: string; // URL da imagem do produto
  className?: string; // Permite controlar o tamanho com Tailwind
}

const RoundedStar: React.FC<RoundedStarProps> = ({ imageUrl, className = 'w-48 h-48' }) => {
    const uniqueId = useId();
    const clipPathId = `star-clip-${uniqueId}`;

    const numPoints = 12; // número de pontas
    const outerRadius = 50; // raio externo (em % do viewBox)
    const innerRadius = outerRadius * 0.89; // raio interno, mantendo o ratio
    const center = { x: 50, y: 50 };

    // Fatores de arredondamento
    const outerRound = 1.0;
    const innerRound = 0.8;

    // Calcula os 24 vértices (alternando entre externo e interno)
    const vertices = useMemo(() => {
        const pts = [];
        const angleStep = Math.PI / numPoints; // 360°/24 = 15° por vértice
        for (let i = 0; i < 2 * numPoints; i++) {
            const angle = i * angleStep - Math.PI / 2; // iniciando no topo
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            pts.push({
                x: center.x + r * Math.cos(angle),
                y: center.y + r * Math.sin(angle),
                isOuter: i % 2 === 0,
            });
        }
        return pts;
    }, [numPoints, outerRadius, innerRadius, center]);

    // Função para interpolar entre dois pontos
    const getPointAlong = (
        p1: { x: number; y: number },
        p2: { x: number; y: number },
        t: number,
    ) => ({
        x: p1.x + (p2.x - p1.x) * t,
        y: p1.y + (p2.y - p1.y) * t,
    });

    // Monta o atributo "d" do path com curvas quadráticas (Q)
    const d = useMemo(() => {
        let dPath = '';
        const total = vertices.length;
        for (let i = 0; i < total; i++) {
            const prev = vertices[(i - 1 + total) % total];
            const curr = vertices[i];
            const next = vertices[(i + 1) % total];
            const fraction = 0.35 * (curr.isOuter ? outerRound : innerRound);
            const p1 = getPointAlong(prev, curr, 1 - fraction);
            const p2 = getPointAlong(curr, next, fraction);
            if (i === 0) {
                dPath += `M ${p1.x} ${p1.y} `;
            } else {
                dPath += `L ${p1.x} ${p1.y} `;
            }
            dPath += `Q ${curr.x} ${curr.y}, ${p2.x} ${p2.y} `;
        }
        dPath += 'Z';
        return dPath;
    }, [vertices, outerRound, innerRound]);

    return (
        <svg viewBox="0 0 100 100" className={ className }>
            <defs>
                { /* Define o clipPath com um id único */ }
                <clipPath id={ clipPathId }>
                    <path d={ d } />
                </clipPath>
            </defs>

            { /* Imagem recortada pela forma da estrela */ }
            <image
                href={ imageUrl }
                x="0"
                y="0"
                width="100"
                height="100"
                clipPath={ `url(#${clipPathId})` }
                preserveAspectRatio="xMidYMid slice"
            />

            { /* Contorno opcional (se desejar) */ }
            <path d={ d } fill="none" stroke="none" strokeWidth="0" />
        </svg>
    );
};

export default RoundedStar;
