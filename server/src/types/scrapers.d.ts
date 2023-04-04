export interface NFLTeamStandingsI {
    wins: number
    losses: number
    ties: number
    winPercentage: number
    homeRecord: string
    visitorRecord: string
    divisionRecord: string
    conferenceRecord: string
    pointsFor: number
    pointsAgainst: number
    pointsDifferential: number
    currentStreak: string
    overallRecord: string
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
    kickTotalYards: number
    kickLong: number
    kickTouchdowns: number
    kickAttempts: number
    averageYardsPerKick: number
    puntTotalYards: number
    puntLong: number
    puntTouchdowns: number
    puntAttempts: number
    averageYardsPerPunt: number
    fairCatches: number
}

interface NFLTurnoversI {
    ratio: number
    takeawayInterceptions: number
    takeawayFumbles: number
    takeawayTotal: number
    giveawayInterceptions: number
    giveawayFumbles: number
    giveawayTotal: number
}

export interface NFLTeamI {
    name: string
    code: string
    standings: NFLTeamStandingsI,
    stats: {
        offense: NFLStatsOffenseDefenseI
        defense: NFLStatsOffenseDefenseI
        specialTeams: NFLSpecialTeamsI
        turnovers: NFLTurnoversI
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

export interface SetSpecialTeamsI {
    [key: string]: {
        name: string
        specialTeams: NFLSpecialTeamsI
    }
}

export interface SetTurnoversI {
    [key: string]: {
        name: string
        turnovers: NFLTurnoversI
    }
}

export interface SetNFLTeamsI {
    [key: string]: {
        name: string
        code: string
        standings: NFLTeamStandingsI,
        stats: {
            offense: NFLStatsOffenseDefenseI
            defense: NFLStatsOffenseDefenseI
            specialTeams: NFLSpecialTeamsI
            turnovers: NFLTurnoversI
        }
    }
}