import axios from "axios"
import * as cheerio from "cheerio"

class Scraper {
    public url: string

    constructor(url: string) {
        this.url = url
        this.launch()
    }

    private async launch() {
        try {
            const start = Date.now()
            const axiosResponse = await axios.request({
                method: "GET",
                url: this.url, 
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
                }
            }) 

            interface Test {
                [key: string]: {
                    name: string
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
            }

            const dataTransformed: Test = {}

            const $ = cheerio.load(axiosResponse.data)
            $("[data-idx]").each((_index, element) => {

                const teamName = $(element).find(".hide-mobile").find(".AnchorLink").text()
                const stats = $(element).find("span.stat-cell")

                if (teamName) {
                    dataTransformed[element.attribs["data-idx"]] = {
                        ...dataTransformed[element.attribs["data-idx"]],
                        name: teamName
                    }
                }

                if (stats) {
                    const statsArr: string[] = []
                    let props: any = {}
                    const statsProperties = [
                        "wins",
                        "losses",
                        "ties",
                        "winPercentage",
                        "homeRecord",
                        "awayRecord", 
                        "divisionRecord",
                        "conferenceRecord",
                        "pointsFor",
                        "pointsAgainst",
                        "pointsDifferential",
                        "currentStreak"
                    ]

                    stats.each((_idx, elm) => {
                        statsArr.push($(elm).text())
                    })

                    statsProperties.forEach((stat, i) => {
                        props = {
                            ...props,
                            [stat]: statsArr[i]
                        }
                    })



                    dataTransformed[element.attribs["data-idx"]] = {
                        ...dataTransformed[element.attribs["data-idx"]],
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
                
            })
        
            const end = Date.now()

            console.log(dataTransformed)
            console.log(`running time: ${end - start} ms`)

        } catch (error) {
            console.log(error)
        }
    }
}

new Scraper("https://www.espn.com/nfl/standings/_/group/league")
