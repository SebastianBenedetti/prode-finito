import { Match, Prediction } from "../models/relations.js";
import { calculatePoints } from "./prediction.service.js";

export const getAllMatches = async () => {
  return await Match.findAll({ order: [["matchOrder", "ASC"]] });
};

export const updateMatchResult = async (matchId, homeScore, awayScore) => {
  const match = await Match.findByPk(matchId);
  if (!match) throw new Error("Partido no encontrado");

  match.homeScore = homeScore;
  match.awayScore = awayScore;
  match.played = true;
  await match.save();

  // Recalcular puntos para todas las predicciones de este partido
  const predictions = await Prediction.findAll({ where: { matchId } });
  for (const pred of predictions) {
    pred.points = calculatePoints(
      { homeScore: pred.homeScore, awayScore: pred.awayScore },
      { homeScore, awayScore },
    );
    await pred.save();
  }

  return match;
};

// Seed del fixture completo del Mundial 2026
export const seedMatches = async () => {
  const count = await Match.count();
  if (count > 0) return; // ya está cargado

  // Grupos del Mundial 2026 (48 equipos, 12 grupos de 4)
  const groups = {
    A: [
      ["México", "🇲🇽"],
      ["USA", "🇺🇸"],
      ["Canadá", "🇨🇦"],
      ["Nueva Zelanda", "🇳🇿"],
    ],
    B: [
      ["España", "🇪🇸"],
      ["Portugal", "🇵🇹"],
      ["Marruecos", "🇲🇦"],
      ["Bélgica", "🇧🇪"],
    ],
    C: [
      ["Brasil", "🇧🇷"],
      ["Argentina", "🇦🇷"],
      ["Colombia", "🇨🇴"],
      ["Ecuador", "🇪🇨"],
    ],
    D: [
      ["Francia", "🇫🇷"],
      ["Alemania", "🇩🇪"],
      ["Países Bajos", "🇳🇱"],
      ["Austria", "🇦🇹"],
    ],
    E: [
      ["Inglaterra", "🏴󠁧󠁢󠁥󠁮󠁧󠁿"],
      ["Italia", "🇮🇹"],
      ["Turquía", "🇹🇷"],
      ["Gales", "🏴󠁧󠁢󠁷󠁬󠁳󠁿"],
    ],
    F: [
      ["Japón", "🇯🇵"],
      ["Corea del Sur", "🇰🇷"],
      ["Australia", "🇦🇺"],
      ["Arabia Saudita", "🇸🇦"],
    ],
    G: [
      ["Senegal", "🇸🇳"],
      ["Nigeria", "🇳🇬"],
      ["Costa de Marfil", "🇨🇮"],
      ["Ghana", "🇬🇭"],
    ],
    H: [
      ["Uruguay", "🇺🇾"],
      ["Chile", "🇨🇱"],
      ["Perú", "🇵🇪"],
      ["Bolivia", "🇧🇴"],
    ],
    I: [
      ["Croacia", "🇭🇷"],
      ["Serbia", "🇷🇸"],
      ["Dinamarca", "🇩🇰"],
      ["Escocia", "🏴󠁧󠁢󠁳󠁣󠁴󠁿"],
    ],
    J: [
      ["Polonia", "🇵🇱"],
      ["República Checa", "🇨🇿"],
      ["Eslovaquia", "🇸🇰"],
      ["Rumanía", "🇷🇴"],
    ],
    K: [
      ["México B", "🇲🇽"],
      ["Costa Rica", "🇨🇷"],
      ["Honduras", "🇭🇳"],
      ["Panamá", "🇵🇦"],
    ],
    L: [
      ["Irán", "🇮🇷"],
      ["Irak", "🇮🇶"],
      ["Uzbekistán", "🇺🇿"],
      ["Tayikistán", "🇹🇯"],
    ],
  };

  let order = 0;
  for (const [group, teams] of Object.entries(groups)) {
    // 6 partidos por grupo (round robin)
    const matchups = [
      [0, 1],
      [2, 3],
      [0, 2],
      [1, 3],
      [0, 3],
      [1, 2],
    ];
    for (const [i, j] of matchups) {
      await Match.create({
        phase: "Grupos",
        group,
        homeTeam: teams[i][0],
        homeFlag: teams[i][1],
        awayTeam: teams[j][0],
        awayFlag: teams[j][1],
        matchOrder: order++,
      });
    }
  }

  // Fases eliminatorias (placeholders — se actualizan cuando avancen los equipos)
  const elimPhases = [
    { phase: "Octavos", count: 16 },
    { phase: "Cuartos", count: 8 },
    { phase: "Semifinal", count: 4 },
    { phase: "Final", count: 2 },
  ];

  for (const { phase, count } of elimPhases) {
    for (let i = 0; i < count / 2; i++) {
      await Match.create({
        phase,
        homeTeam: `Por definir`,
        awayTeam: `Por definir`,
        matchOrder: order++,
      });
    }
  }

  console.log("Fixture seed OK");
};
