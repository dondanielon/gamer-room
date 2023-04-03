export interface NFLTeamStandingsI {
    wins: number
    losses: number
    ties: number
    winPercentage: number
    localRecord: string
    visitorRecord: string
    divisionRecord: string
    conferenceRecord: string
    pointsFor: number
    pointsAgainst: number
    pointsDifferential: number
    currentStreak: string
}

export interface NFLStatsOffenseDefenseI {
    totalYards: number
    yardsPerGame: number
    totalPassingYards: number
    passingYardsPerGame: number
    totalRushingYards: number
    rushingYardsPerGame: number
    totalPoints: number
    pointsPerGame: number
}

interface NFLSpecialTeamsI {
    totalYards: number
    long: number
    touchdowns: number
}

interface NFLSpecialTeamsKickoffsI extends NFLSpecialTeamsI {
    kickAttempts: number
    averageYardsPerKick: number
}

interface NFLSpecialTeamsPuntsI extends NFLSpecialTeamsI {
    puntAttempts: number
    averageYardsPerPunt: number
    fairCatches: number
}

interface NFLTurnoversI {
    interceptions: number
    fumbles: number
    total: number
}

export interface NFLTeamI {
    name: string
    code: string
    standings: NFLTeamStandingsI,
    stats: {
        offense: NFLStatsOffenseDefenseI
        defense: NFLStatsOffenseDefenseI
        specialTeams: {
            kickoffs: NFLSpecialTeamsKickoffsI
            punts: NFLSpecialTeamsPuntsI
        }
        turnovers: {
            ratio: number
            takeaways: NFLTurnoversI
            giveaways: NFLTurnoversI
        }
    }
}

export interface SetTeamsStandingsI {
    [key: string]: {
        name: string
        code: string
        standings: NFLTeamStandingsI
    }
}

export interface SetTeamsOffenseI {
    [key: string]: {
        name: string
        offense: NFLStatsOffenseDefenseI
    }
}

export interface SetTeamsDefenseI {
    [key: string]: {
        name: string
        defense: NFLStatsOffenseDefenseI
    }
}