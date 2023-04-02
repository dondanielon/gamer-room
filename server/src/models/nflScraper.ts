import axios, { AxiosInstance } from "axios"
import * as cheerio from "cheerio"

interface Team {
    name: string
        code: string
        standings: {
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
        },
        stats: {
            offense: {
                totalYards: number
                yardsPerGame: number
                passing: {
                    total: number
                    perGame: number
                },
                rushing: {
                    total: number
                    perGame: number
                },
                points: {
                    total: number
                    perGame: number
                }
            }
            defense: {
                totalYards: number
                yardsPerGame: number
                passing: {
                    total: number
                    perGame: number
                },
                rushing: {
                    total: number
                    perGame: number
                },
                points: {
                    total: number
                    perGame: number
                }
            }
            specialTeams: {
                kickoffs: {
                    kickAttempts: number
                    totalYards: number
                    averageYardsPerKick: number
                    long: number
                    touchdowns: number
                }
                punts: {
                    puntAttempts: number
                    totalYards: number
                    averageYardsPerPunt: number
                    long: number
                    touchdowns: number
                    fairCatches: number
                }
            }
            turnovers: {
                ratio: number
                takeaways: {
                    interceptions: number
                    fumbles: number
                    total: number
                }
                giveaways: {
                    interceptions: number
                    fumbles: number
                    total: number
                }
            }
        }
}
interface Test {
    [key: string]: Team
}

class NFLScraper {
    private TEAM_STANDINGS_URL: string
    // private TEAM_OFFENSE_STATS_URL: string
    // private TEAM_DEFENSE_STATS_URL: string
    // private TEAM_SPECIAL_TEAMS_STATS_URL: string
    // private TEAM_TURNOVERS_STATS_URL: string
    private axiosInstance: AxiosInstance
    private teams: Array<Team>


    constructor() {
        this.TEAM_STANDINGS_URL = "https://www.espn.com/nfl/standings/_/group/league"
        // this.TEAM_OFFENSE_STATS_URL = "https://www.espn.com/nfl/stats/team/_/view/offense"
        // this.TEAM_DEFENSE_STATS_URL = "https://www.espn.com/nfl/stats/team/_/view/defense"
        // this.TEAM_SPECIAL_TEAMS_STATS_URL = "https://www.espn.com/nfl/stats/team/_/view/special"
        // this.TEAM_TURNOVERS_STATS_URL = "https://www.espn.com/nfl/stats/team/_/view/turnovers"
        this.axiosInstance = axios.create({
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36" },
        })
        this.teams = []
    }

    async launch() {
        try {
            await this.setTeamsAndStandings()
            await this.setTeamOffenseStats()
            console.log(this.teams)
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    private async setTeamOffenseStats() {
        // const axiosResponse = await this.axiosInstance.request({
        //     method: "GET",
        //     url: this.TEAM_OFFENSE_STATS_URL,
        // })
    }

    private async setTeamsAndStandings() {
        try {
            const axiosResponse = await this.axiosInstance.request({
                method: "GET",
                url: this.TEAM_STANDINGS_URL
            })
            const dataTransformed: Test = {}

            const $ = cheerio.load(axiosResponse.data)
            $("[data-idx]").each((_index, element) => {

                const teamName = $(element).find(".hide-mobile").find(".AnchorLink").text()
                const teamCode = $(element).find(".show-mobile").find("abbr").text()
                const stats = $(element).find("span.stat-cell")

                if (teamName && teamCode) {
                    dataTransformed[element.attribs["data-idx"]] = {
                        ...dataTransformed[element.attribs["data-idx"]],
                        name: teamName,
                        code: teamCode
                    }
                }

                if (stats) {
                    let props: any = {}
                    const statsProperties = [
                        "wins", "losses", "ties", "winPercentage",
                        "homeRecord", "awayRecord", "divisionRecord", "conferenceRecord",
                        "pointsFor", "pointsAgainst", "pointsDifferential", "currentStreak"
                    ]

                    stats.each((idx, elm) => {
                        props = {
                            ...props,
                            [statsProperties[idx]]: $(elm).text()
                        }
                    })

                    dataTransformed[element.attribs["data-idx"]] = {
                        ...dataTransformed[element.attribs["data-idx"]],
                        standings: {
                            ...props, 
                            wins: parseInt(props.wins),
                            losses: parseInt(props.losses),
                            ties: parseInt(props.ties),
                            winPercentage: parseFloat(props.winPercentage),
                            pointsFor: parseInt(props.pointsFor),
                            pointsAgainst: parseInt(props.pointsAgainst),
                            pointsDifferential: parseInt(props.pointsDifferential)
                        }
                    }
                }
            })

            for (const [_key, value] of Object.entries(dataTransformed)) {
                this.teams.push(value)
            }
        } catch (error) {
            throw error
        }
    }
}

const nfl = new NFLScraper()
nfl.launch()
