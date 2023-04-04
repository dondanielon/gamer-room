import axios, { AxiosInstance } from "axios"
import * as cheerio from "cheerio"
import { 
    type NFLTeamI, 
    type NFLTeamStandingsI, 
    type SetSpecialTeamsI, 
    type SetTeamsDefenseI, 
    type SetTeamsOffenseI, 
    type SetTeamsStandingsI, 
    type SetTurnoversI 
} from "../types/scrapers.d"

class NFLScraper {
    private TEAM_STANDINGS_URL: string
    private TEAM_OFFENSE_STATS_URL: string
    private TEAM_DEFENSE_STATS_URL: string
    private TEAM_SPECIAL_TEAMS_STATS_URL: string
    private TEAM_TURNOVERS_STATS_URL: string
    // private PLAYER_RUSHING_OFFENSE_STATS_URL: string
    private axiosInstance: AxiosInstance
    private teams: Array<NFLTeamI>

    constructor() {
        this.TEAM_STANDINGS_URL = "https://www.espn.com/nfl/standings/_/group/league"
        this.TEAM_OFFENSE_STATS_URL = "https://www.espn.com/nfl/stats/team/_/view/offense"
        this.TEAM_DEFENSE_STATS_URL = "https://www.espn.com/nfl/stats/team/_/view/defense"
        this.TEAM_SPECIAL_TEAMS_STATS_URL = "https://www.espn.com/nfl/stats/team/_/view/special"
        this.TEAM_TURNOVERS_STATS_URL = "https://www.espn.com/nfl/stats/team/_/view/turnovers"
        // this.PLAYER_RUSHING_OFFENSE_STATS_URL = "https://www.espn.com/nfl/stats/player/_/stat/rushing"
        this.axiosInstance = axios.create({
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36" },
        })
        this.teams = []
    }

    getTeam(teamCode: string) {
        const team = this.teams.find(team => teamCode === team.code)
        return team ? team : "INVALID TEAM"
    }

    async scrap() {
        try {
            const start = Date.now()
            const [
                standings, 
                offenseStats, 
                defenseStats, 
                specialTeamsStats, 
                turnovers,
                // playerRushingOffenseStats
            ] = await Promise.all([
                this.setTeamsStandings(),
                this.setTeamsOffenseStats(),
                this.setTeamsDefenseStats(),
                this.setSpecialTeamsStats(),
                this.setTeamsTurnoverStats(),
                this.setPlayerRushingOffenseStats()
            ])

            if (standings && offenseStats && defenseStats && specialTeamsStats && turnovers ) {
                // console.log(playerRushingOffenseStats)
                // const teams: SetNFLTeamsI = {}
                // standings.forEach((item) => {
                //     teams[item.name] = {
                //         ...teams[item.name],
                //         name: item.name,
                //         code: item.code,
                //         standings: item.standings
                //     }
                // })

                // for (let i = 0; i < 32; i++) {
                //     teams[offenseStats[i].name] = {
                //         ...teams[offenseStats[i].name],
                //         stats: {
                //             ...teams[offenseStats[i].name].stats,
                //             offense: offenseStats[i].offense
                //         }
                //     }
                //     teams[defenseStats[i].name] = {
                //         ...teams[defenseStats[i].name],
                //         stats: {
                //             ...teams[defenseStats[i].name].stats,
                //             defense: defenseStats[i].defense
                //         }
                //     }
                //     teams[specialTeamsStats[i].name] = {
                //         ...teams[specialTeamsStats[i].name],
                //         stats: {
                //             ...teams[specialTeamsStats[i].name].stats,
                //             specialTeams: specialTeamsStats[i].specialTeams
                //         }
                //     }
                //     teams[turnovers[i].name] = {
                //         ...teams[turnovers[i].name],
                //         stats: {
                //             ...teams[turnovers[i].name].stats,
                //             turnovers: turnovers[i].turnovers
                //         }
                //     }
                // }
                // this.teams = Object.values(teams)   
            }

            const end = Date.now()
            console.log(`Scraping took ${end - start}ms`)
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    private async setPlayerRushingOffenseStats() {
        const axiosResponse = await this.axiosInstance.request({
            method: "GET",
            // url: this.PLAYER_RUSHING_OFFENSE_STATS_URL
            url: `https://site.web.api.espn.com/apis/v2/sports/football/nfl/standings?region=us&lang=en&contentorigin=espn&type=0&level=1&sort=winpercent%3Adesc%2Cplayoffseed%3Aasc&startingseason=2022`
        })

        const teams = axiosResponse.data.standings.entries
        const data: {
            [key: string]: {
                name: string
                shortDisplayName: string
                code: string
                standings: NFLTeamStandingsI
            }
        } = {}

        teams.forEach((item: any) => {
            const code = item.team.abbreviation
            data[code] = {
                ...data[code],
                name: item.team.displayName,
                shortDisplayName: item.team.shortDisplayName,
                code: code
            }

            item.stats.forEach((stat: any) => {
                switch(stat.name) {
                    case "overall": 
                        data[code] = {
                            ...data[code],
                            standings: {
                                ...data[code].standings,
                                overallRecord: stat.displayValue
                            }
                        }
                        break
                    case "differential": 
                        data[code] = {
                            ...data[code],
                            standings: {
                                ...data[code].standings,
                                pointsDifferential: stat.value
                            }
                        }
                        break
                    case "wins": 
                        data[code] = {
                            ...data[code],
                            standings: {
                                ...data[code].standings,
                                wins: stat.value
                            }
                        }
                        break
                    case "losses": 
                        data[code] = {
                            ...data[code],
                            standings: {
                                ...data[code].standings,
                                losses: stat.value
                            }
                        }
                        break
                    case "ties": 
                        data[code] = {
                            ...data[code],
                            standings: {
                                ...data[code].standings,
                                ties: stat.value
                            }
                        }
                        break
                    case "pointsAgainst": 
                        data[code] = {
                            ...data[code],
                            standings: {
                                ...data[code].standings,
                                pointsAgainst: stat.value
                            }
                        }
                        break
                    case "winPercent": 
                        data[code] = {
                            ...data[code],
                            standings: {
                                ...data[code].standings,
                                winPercentage: stat.value
                            }
                        }
                        break
                    case "pointsFor": 
                        data[code] = {
                            ...data[code],
                            standings: {
                                ...data[code].standings,
                                pointsFor: stat.value
                            }
                        }
                        break
                    case "streak": 
                        data[code] = {
                            ...data[code],
                            standings: {
                                ...data[code].standings,
                                currentStreak: stat.displayValue
                            }
                        }
                        break
                    case "Home": 
                        data[code] = {
                            ...data[code],
                            standings: {
                                ...data[code].standings,
                                homeRecord: stat.displayValue
                            }
                        }
                        break
                    case "Road": 
                        data[code] = {
                            ...data[code],
                            standings: {
                                ...data[code].standings,
                                visitorRecord: stat.displayValue
                            }
                        }
                        break
                    case "vs. Div.": 
                        data[code] = {
                            ...data[code],
                            standings: {
                                ...data[code].standings,
                                divisionRecord: stat.displayValue
                            }
                        }
                        break
                    case "vs. Conf.": 
                        data[code] = {
                            ...data[code],
                            standings: {
                                ...data[code].standings,
                                conferenceRecord: stat.displayValue
                            }
                        }
                        break
                    default: 
                        break
                }
            })
        })

        try {
            const testResponse = await this.axiosInstance.request({
                method: "GET",
                url: "https://site.web.api.espn.com/apis/site/v2/sports/football/nfl/statistics?region=us&lang=en&contentorigin=espn"
            })
            
            // const teamStats = testResponse.data.results.stats.categories
            console.log(testResponse.data.stats.categories.at(-1).leaders.at(0))
        } catch (error) {
            console.log(error)
        }
    }

    private async setTeamsTurnoverStats() {
        const axiosResponse = await this.axiosInstance.request({
            method: "GET",
            url: this.TEAM_TURNOVERS_STATS_URL
        })
        const data: SetTurnoversI = {}
        const $ = cheerio.load(axiosResponse.data)

        $("[data-idx]").each((_index, element) => {
            const htmlIndex = element.attribs["data-idx"]
            const statsArr: Array<string> = []
            const teamName = $(element).find(".Image").attr("title")

            $(element).find(".Table__TD").each((_idx, elm) => {
                const tagText = $(elm).find("div").text()
                const stat = tagText.includes(",") ? tagText.replace(",", "") : tagText
                statsArr.push(stat)
            })
            statsArr.shift()

            if (teamName) {
                data[htmlIndex] = {
                    ...data[htmlIndex],
                    name: teamName
                } 
            }

            if (statsArr.length === 7) {
                const specialTeamsProperties = [
                    "ratio", "takeawayInterceptions", "takeawayFumbles", "takeawayTotal", 
                    "giveawayInterceptions", "giveawayFumbles", "giveawayTotal"
                ]
                specialTeamsProperties.forEach((item, index) => {
                    data[htmlIndex] = {
                        ...data[htmlIndex],
                        turnovers: {
                            ...data[htmlIndex].turnovers,
                            [item]: parseInt(statsArr[index])  
                        }
                    }
                })
            }
        })
        return Object.values(data)
    }

    private async setSpecialTeamsStats() {
        const axiosResponse = await this.axiosInstance.request({
            method: "GET",
            url: this.TEAM_SPECIAL_TEAMS_STATS_URL
        })
        const data: SetSpecialTeamsI = {}
        const $ = cheerio.load(axiosResponse.data)

        $("[data-idx]").each((_index, element) => {
            const htmlIndex = element.attribs["data-idx"]
            const statsArr: Array<string> = []
            const teamName = $(element).find(".Image").attr("title")

            $(element).find(".Table__TD").each((_idx, elm) => {
                const tagText = $(elm).find("div").text()
                const stat = tagText.includes(",") ? tagText.replace(",", "") : tagText
                statsArr.push(stat)
            })
            statsArr.shift()

            if (teamName) {
                data[htmlIndex] = {
                    ...data[htmlIndex],
                    name: teamName
                } 
            }

            if (statsArr.length === 11) {
                const specialTeamsProperties = [
                    "kickAttempts", "kickTotalYards", "averageYardsPerKick", "kickLong", "kickTouchdowns", 
                    "puntAttempts", "puntTotalYards", "averageYardsPerPunt", "puntLong", "puntTouchdowns", "fairCatches"
                ]
                specialTeamsProperties.forEach((item, index) => {
                    data[htmlIndex] = {
                        ...data[htmlIndex],
                        specialTeams: {
                            ...data[htmlIndex].specialTeams,
                            [item]: parseFloat(statsArr[index])  
                        }
                    }
                })
            }
        })
        return Object.values(data)
    }

    private async setTeamsDefenseStats() {
        const axiosResponse = await this.axiosInstance.request({
            method: "GET",
            url: this.TEAM_DEFENSE_STATS_URL,
        })
        const data: SetTeamsDefenseI = {}
        const $ = cheerio.load(axiosResponse.data)

        $("[data-idx]").each((_index, element) => {
            const htmlIndex = element.attribs["data-idx"]
            const statsArr: Array<string> = []
            const teamName = $(element).find(".Image").attr("title")

            $(element).find(".Table__TD").each((_idx, elm) => {
                const tagText = $(elm).find("div").text()
                const stat = tagText.includes(",") ? tagText.replace(",", "") : tagText
                statsArr.push(stat)
            })
            statsArr.shift()
            
            if (teamName) {
                data[htmlIndex] = {
                    ...data[htmlIndex],
                    name: teamName
                }
            }

            if (statsArr.length === 8) {
                const offenseProperties = [
                    "totalYards", "yardsPerGame", "totalPassingYards", "passingYardsPerGame",
                    "totalRushingYards", "rushingYardsPerGame", "totalPoints" ,"pointsPerGame"
                ]

                offenseProperties.forEach((item, index) => {
                    data[htmlIndex] = {
                        ...data[htmlIndex],
                        defense: {
                            ...data[htmlIndex].defense,
                            [item]: parseFloat(statsArr[index]) 
                        }
                    }
                })
            }
        })
        return Object.values(data)
    }

    private async setTeamsOffenseStats() {
        const axiosResponse = await this.axiosInstance.request({
            method: "GET",
            url: this.TEAM_OFFENSE_STATS_URL,
        })
        const data: SetTeamsOffenseI = {}
        const $ = cheerio.load(axiosResponse.data)

        $("[data-idx]").each((_index, element) => {
            const htmlIndex = element.attribs["data-idx"]
            const statsArr: Array<string> = []
            const teamName = $(element).find(".Image").attr("title")

            $(element).find(".Table__TD").each((_idx, elm) => {
                let stat = $(elm).find("div").text()
                stat = stat.includes(",") ? stat.replace(",", "") : stat
                statsArr.push(stat)
            })
            statsArr.shift()
            
            if (teamName) {
                data[htmlIndex] = {
                    ...data[htmlIndex],
                    name: teamName
                }
            }

            if (statsArr.length === 8) {
                const offenseProperties = [
                    "totalYards", "yardsPerGame", "totalPassingYards", "passingYardsPerGame",
                    "totalRushingYards", "rushingYardsPerGame", "totalPoints" ,"pointsPerGame"
                ]

                offenseProperties.forEach((item, index) => {
                    data[htmlIndex] = {
                        ...data[htmlIndex],
                        offense: {
                            ...data[htmlIndex].offense,
                            [item]: parseFloat(statsArr[index]) 
                        }
                    }
                })
            }
        })
        return Object.values(data)
    }

    private async setTeamsStandings() {
        try {
            const axiosResponse = await this.axiosInstance.request({
                method: "GET",
                url: this.TEAM_STANDINGS_URL
            })
            const data: SetTeamsStandingsI = {}
            const $ = cheerio.load(axiosResponse.data)

            $("[data-idx]").each((_index, element) => {
                const teamName = $(element).find(".hide-mobile").find(".AnchorLink").text()
                const teamCode = $(element).find(".show-mobile").find("abbr").text()
                const standings = $(element).find("span.stat-cell")
                const htmlIndex = element.attribs["data-idx"]

                if (teamName && teamCode) {
                    data[htmlIndex] = {
                        ...data[htmlIndex],
                        name: teamName,
                        code: teamCode
                    }
                }

                if (standings) {
                    const standingsProperties = [
                        "wins", "losses", "ties", "winPercentage",
                        "homeRecord", "awayRecord", "divisionRecord", "conferenceRecord",
                        "pointsFor", "pointsAgainst", "pointsDifferential", "currentStreak"
                    ]
                    standings.each((idx, elm) => {
                        let value: string | number

                        if (
                            standingsProperties[idx] === "homeRecord" ||
                            standingsProperties[idx] === "awayRecord" ||
                            standingsProperties[idx] === "divisionRecord" ||
                            standingsProperties[idx] === "conferenceRecord" ||
                            standingsProperties[idx] === "currentStreak"
                        ) {
                            value = $(elm).text()
                        } else {
                            value = parseFloat($(elm).text())
                        }
                        data[htmlIndex] = {
                            ...data[htmlIndex],
                            standings: {
                                ...data[htmlIndex].standings,
                                [standingsProperties[idx]]: value
                            }
                        }
                    })
                }
            })
            return Object.values(data)
        } catch (error) {
            throw error
        }
    }
}

export default NFLScraper

// async function start() {
//     const nfl = new NFLScraper()
//     await nfl.scrap() 
    
//     console.log(nfl.getTeam("CHI"))
// }

// start()



