import axios, { AxiosInstance } from "axios"
import * as cheerio from "cheerio"
import { NFLTeamI, SetTeamsDefenseI, SetTeamsOffenseI, SetTeamsStandingsI } from "../types/scrapers"

class NFLScraper {
    private TEAM_STANDINGS_URL: string
    private TEAM_OFFENSE_STATS_URL: string
    private TEAM_DEFENSE_STATS_URL: string
    // private TEAM_SPECIAL_TEAMS_STATS_URL: string
    // private TEAM_TURNOVERS_STATS_URL: string
    private axiosInstance: AxiosInstance
    private teams: Array<NFLTeamI>


    constructor() {
        this.TEAM_STANDINGS_URL = "https://www.espn.com/nfl/standings/_/group/league"
        this.TEAM_OFFENSE_STATS_URL = "https://www.espn.com/nfl/stats/team/_/view/offense"
        this.TEAM_DEFENSE_STATS_URL = "https://www.espn.com/nfl/stats/team/_/view/defense"
        // this.TEAM_SPECIAL_TEAMS_STATS_URL = "https://www.espn.com/nfl/stats/team/_/view/special"
        // this.TEAM_TURNOVERS_STATS_URL = "https://www.espn.com/nfl/stats/team/_/view/turnovers"
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
            // const teamStandings = await this.setTeamsStandings()
            // const teamsOffense = await this.setTeamOffenseStats()
            // if (teamStandings && teamsOffense) console.log(teamStandings)
            
            const [standings, offenseStats, defenseStats] = await Promise.all([
                this.setTeamsStandings(),
                this.setTeamsOffenseStats(),
                this.setTeamsDefenseStats()
            ])

            if (standings && offenseStats && defenseStats) console.log(defenseStats)
            const end = Date.now()
            console.log(`Scraping took ${end - start}ms`)
        } catch (error) {
            console.log(error)
            throw error
        }
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

async function start() {
    const nfl = new NFLScraper()
    await nfl.scrap()  
}

start()



