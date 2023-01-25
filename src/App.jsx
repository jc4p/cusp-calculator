import { useEffect, useState } from 'react'
import './App.css'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import Chart from './Chart'
import { SIGNS_WITH_INFO } from './static'
import { getChart, getLocation } from './api'

dayjs.extend(utc)

function App() {
  const [currentChart, setCurrentChart] = useState(null)
  const [currentTime, setCurrentTime] = useState(null)
  const [minTime, setMinTime] = useState(null)
  const [maxTime, setMaxTime] = useState(null)
  const [backgroundColors, setBackgroundColors] = useState([])
  const [signPossibilities, setSignPossibilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [locationInput, setLocationInput] = useState("New York, NY")
  const [selectedLocation, setSelectedLocation] = useState(null)

  useEffect(() => {
    const startOfDay = dayjs().utc().year(1992).month(0).date(1).hour(0).minute(0);
    const endOfDay = dayjs().utc().year(1992).month(0).date(2).hour(0).minute(0);

    setMinTime(startOfDay.valueOf())
    setMaxTime(endOfDay.valueOf())

    setDefaultChart()
  }, [])

  const setDefaultChart = async () => {
    const defaultLocation = await getLocationSuggestions()
    setSelectedLocation(defaultLocation)

    if (!defaultLocation || !defaultLocation.geo) { return }

    const noon = dayjs().utc().year(1992).month(0).date(1).hour(12).minute(0);
    const chart = await getChart(noon.year(), noon.month() + 1, noon.date(), noon.hour(), noon.minute(), 0, defaultLocation)
    setCurrentTime(noon.valueOf())
    setCurrentChart(chart)

    const { startColor, endColor } = SIGNS_WITH_INFO[chart.chart.planets.Sun.planet.sign]
    setBackgroundColors([startColor, endColor])

    setLoading(false)
    await fetchWholeDay(defaultLocation)
  }

  const fetchWholeDay = async (location) => {
    if (!(minTime && maxTime)) { return }

    setSignPossibilities([])

    const dateOptions = []
    let momentTime = dayjs(minTime)
    dateOptions.push(momentTime.valueOf())
    while (momentTime.isBefore(maxTime) && !momentTime.isSame(maxTime)) {
      momentTime = momentTime.add(2, 'hour')
      dateOptions.push(momentTime.valueOf())
    }

    const fullDay = []
    for (let i = 0; i < dateOptions.length; i++) {
      const moment = dayjs(dateOptions[i])
      const chart = await getChart(moment.year(), moment.month() + 1, moment.date(), moment.hour(), moment.minute(), 0, location)
      fullDay.push(chart)
    }

    const possibleSigns = getPossibleSunSigns(fullDay)
    setSignPossibilities(possibleSigns)
  }

  const getPossibleSunSigns = (fullDay) => {
    if (!fullDay || fullDay.length === 0) { return [] }

    const signOptions = fullDay.reduce((acc, cur) => {
      acc.push(cur.chart.planets.Sun.planet.sign)
      return acc
    }, [])

    const signOccurences = signOptions.reduce((acc, cur) => {
      const oldValue = acc[cur] || 0
      acc[cur] = oldValue + 1
      return acc
    }, {})

    const signOdds = Object.keys(signOccurences).map((i) => {
      return { sign: i, percent: (signOccurences[i] / fullDay.length) * 100 }
    })

    return signOdds
  }

  const getLocationSuggestions = async () => {
    const res = await getLocation(locationInput)
    
    return res
  }

  const onLocationInputChange = (e) => {
    if (!e.target.value) { return }

    setLocationInput(e.target.value)
  }

  const onMonthChange = (e) => {
    if (!currentTime) { return }

    const updatedTime = dayjs.utc(currentTime).month(Number(e.target.value))
    const minTime = updatedTime.startOf('day')
    const maxTime = updatedTime.endOf('day')

    setMinTime(minTime.valueOf())
    setMaxTime(maxTime.valueOf())
    setCurrentTime(updatedTime.valueOf())
  }

  const onDateChange = (e) => {
    if (!currentTime) { return }

    const updatedTime = dayjs.utc(currentTime).date(Number(e.target.value))
    const minTime = updatedTime.startOf('day')
    const maxTime = updatedTime.endOf('day')

    setMinTime(minTime.valueOf())
    setMaxTime(maxTime.valueOf())
    setCurrentTime(updatedTime.valueOf())
  }

  const onYearChange = (e) => {
    if (!currentTime) { return }
    const updatedTime = dayjs.utc(currentTime).year(Number(e.target.value))
    const minTime = updatedTime.startOf('day')
    const maxTime = updatedTime.endOf('day')

    setMinTime(minTime.valueOf())
    setMaxTime(maxTime.valueOf())
    setCurrentTime(updatedTime.valueOf())
  }

  useEffect(() => {
    let awaitDay = null
    const getData = setTimeout(async () => {
      if (!currentTime || !selectedLocation) { return }
      setLoading(true)

      if (awaitDay) {
        clearTimeout(awaitDay)
      }

      const dayTime = dayjs.utc(currentTime)
      const chart = await getChart(dayTime.year(), dayTime.month() + 1, dayTime.date(), dayTime.hour(), dayTime.minute(), 0, selectedLocation)
      setCurrentChart(chart)

      const { startColor, endColor } = SIGNS_WITH_INFO[chart.chart.planets.Sun.planet.sign]
      setBackgroundColors([startColor, endColor])
  
      setLoading(false)
      awaitDay = setTimeout(async() => {
        await fetchWholeDay(selectedLocation)
      }, 250)
    }, 250)

    return () => clearTimeout(getData)
  }, [currentTime])

  useEffect(() => {
    if (!locationInput) { return }

    const fetchLocation = setTimeout(async () => {
      const location = await getLocationSuggestions(locationInput)
      setSelectedLocation(location)
    }, 250)

    return () => clearTimeout(fetchLocation)
  }, [locationInput])

  return (
    <div className="App" style={{ '--bg-color-one': backgroundColors[0], '--bg-color-two': backgroundColors[1] }}>
      <div className="inputContainer">
        <div className='dateRow'>
          <select className='monthSelector' onChange={onMonthChange} defaultValue={'0'}>
            <option value="0" label="January" />
            <option value="1" label="February" />
            <option value="2" label="March" />
            <option value="3" label="April" />
            <option value="4" label="May" />
            <option value="5" label="June" />
            <option value="6" label="July" />
            <option value="7" label="August" />
            <option value="8" label="September" />
            <option value="9" label="October" />
            <option value="10" label="November" />
            <option value="11" label="December" />
          </select>
          <select className='dateSelector' onChange={onDateChange} defaultValue={'1'}>
            <option value="1" label="1" />
            <option value="2" label="2" />
            <option value="3" label="3" />
            <option value="4" label="4" />
            <option value="5" label="5" />
            <option value="6" label="6" />
            <option value="7" label="7" />
            <option value="8" label="8" />
            <option value="9" label="9" />
            <option value="10" label="10" />
            <option value="11" label="11" />
            <option value="12" label="12" />
            <option value="13" label="13" />
            <option value="14" label="14" />
            <option value="15" label="15" />
            <option value="16" label="16" />
            <option value="17" label="17" />
            <option value="18" label="18" />
            <option value="19" label="19" />
            <option value="20" label="20" />
            <option value="21" label="21" />
            <option value="22" label="22" />
            <option value="23" label="23" />
            <option value="24" label="24" />
            <option value="25" label="25" />
            <option value="26" label="26" />
            <option value="27" label="27" />
            <option value="28" label="28" />
            <option value="29" label="29" />
            <option value="30" label="30" />
            <option value="31" label="31" />
          </select>
          <select className='yearSelector' onChange={onYearChange} defaultValue={'1992'}>
            <option value="1975" label="1975" />
            <option value="1976" label="1976" />
            <option value="1977" label="1977" />
            <option value="1978" label="1978" />
            <option value="1979" label="1979" />
            <option value="1980" label="1980" />
            <option value="1981" label="1981" />
            <option value="1982" label="1982" />
            <option value="1983" label="1983" />
            <option value="1984" label="1984" />
            <option value="1985" label="1985" />
            <option value="1986" label="1986" />
            <option value="1987" label="1987" />
            <option value="1988" label="1988" />
            <option value="1989" label="1989" />
            <option value="1990" label="1990" />
            <option value="1991" label="1991" />
            <option value="1992" label="1992" />
            <option value="1993" label="1993" />
            <option value="1994" label="1994" />
            <option value="1995" label="1995" />
            <option value="1996" label="1996" />
            <option value="1997" label="1997" />
            <option value="1998" label="1998" />
            <option value="1999" label="1999" />
            <option value="2000" label="2000" />
            <option value="2001" label="2001" />
            <option value="2002" label="2002" />
            <option value="2003" label="2003" />
            <option value="2004" label="2004" />
            <option value="2005" label="2005" />
            <option value="2006" label="2006" />
            <option value="2007" label="2007" />
            <option value="2008" label="2008" />
            <option value="2009" label="2009" />
            <option value="2010" label="2010" />
            <option value="2011" label="2011" />
            <option value="2012" label="2012" />
            <option value="2013" label="2013" />
            <option value="2014" label="2014" />
            <option value="2015" label="2015" />          
          </select>
        </div>
        <div className='locationRow'>
          <input type="text" value={locationInput} onChange={onLocationInputChange} />
        </div>
      </div>
      <div className='resultsContainer'>
        {currentTime && <p>Time: {dayjs(currentTime).format('MM/DD/YYYY')}</p>}
        {selectedLocation && <p>Location: {selectedLocation.location}</p>}
        {signPossibilities.map((prob, i) =>
          <h3 key={`sign_prop_${i}`}>{prob.sign} - {prob.percent.toFixed(2)}%</h3>
        )}
        {currentChart && <Chart chart={currentChart} />}
      </div>
    </div>
  )
}

export default App
