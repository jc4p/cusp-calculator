import { useEffect, useState } from 'react'
import MobileDetect from 'mobile-detect';
import './App.css'
import { SIGNS_WITH_INFO, PLANETS_WITH_INFO } from './static'

function Chart ({ chart }) {
  const [CANVAS_SIZE, setCanvasSize] = useState(600)
  const [ASPECT_RADIUS, setApsectRadius] = useState(120)
  const [CHART_ORIGIN, setChartOrigin] = useState(300)
  const [CHART_RADIUS, setChartRadius] = useState(280)
  const [CHART_INNER_STROKE_WIDTH, setInnerStrokeWidth] = useState(40)

  useEffect(() => {
    if (!chart || !chart.person) { return }

    const isMobile =  new MobileDetect(window.navigator.userAgent).phone();
    if (isMobile) {
      setCanvasSize(300)
      setApsectRadius(60)
      setChartOrigin(150)
      setChartRadius(140)
      setInnerStrokeWidth(20)
    }

    let CHART_INNER_RADIUS = CHART_RADIUS - CHART_INNER_STROKE_WIDTH

    let ctx = document.getElementById('chartCanvas').getContext('2d');

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // first draw the container for the chart
    drawCircle(ctx, CHART_ORIGIN, CHART_ORIGIN, CHART_RADIUS);
    
    // and the inner wall of the container circle
    drawCircle(ctx, CHART_ORIGIN, CHART_ORIGIN, CHART_INNER_RADIUS);
    
    // make a nice little look-up list of what each 30° section is
    let CHART_DIVISIONS = processChartDivisions();

    // Okay now we have the order we need to segment out the circle starting from -x axis
    // and going counter clockwise
    var planets_already_drawn = [];
    for (var i = 0; i < 12; i++) {
      var division = CHART_DIVISIONS[i];

      // How big should the sign icon be, inside of the outer and stroke?
      let divisionIconSize = CHART_INNER_STROKE_WIDTH * 0.60;

      // Draw the first tick for the house (the second one is the same as the first of the next house)
      drawHouseTick(ctx, division.canvas_start);
      // Draw the house icon, cented within the 30°
      drawHouseIconInDivision(ctx, division, divisionIconSize);
      
      // okay and if there are any bodies in this house we need to draw them too
      if (division.planets.length > 0) {
        for (let planet of division.planets) {
          let name = planet.name;

          // This draws both the tick and the planet icon, planet.location degrees inside of the house
          let planetVector = getUnitVectorsFromAngle(division.canvas_start - planet.location);
          drawPlanet(ctx, planet, planetVector, i, divisionIconSize);
          planets_already_drawn.push(name);

          // and if the planet has any aspects, we might need to draw the line now
          if (planet.aspects) {
            for(var j in planet.aspects) {
              let aspect = planet.aspects[j];
              // console.log('Drawing aspect: ', aspect);
              drawAspect(ctx, planet, aspect, planets_already_drawn, division, CHART_DIVISIONS);
            }
          }
        }
      }
    }
  }, [chart])

  const drawCircle = (ctx, x, y, radius) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
  
  const drawLine = (ctx, startX, startY, endX, endY) => {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  
  const drawStyledLine = (ctx, startX, startY, endX, endY, strokeStyle) => {
    ctx.strokeStyle = strokeStyle;
    drawLine(ctx, startX, startY, endX, endY);
    ctx.strokeStyle = '#000';
  }

  const drawHouseTick = (ctx, canvas_start) => {
    // To get the right separator on the chart all we need to do is draw the first tick mark
    // for the 30° range of this sign, since the end of it is the start of the next one (which we'll also draw!)
    let divisionStartVector = getUnitVectorsFromAngle(canvas_start);

    let CHART_INNER_RADIUS = CHART_RADIUS - CHART_INNER_STROKE_WIDTH
    
    // the line needs to go from the far edge of the circle to the inner stroke,
    // and what we have now are x and y unit vectors showing which direction to go to,
    // so we need to shift (for the origin) and multiply out those vectors
    let tickStartX = CHART_ORIGIN + CHART_RADIUS * divisionStartVector.x;
    let tickStartY = CHART_ORIGIN + CHART_RADIUS * divisionStartVector.y;
    let tickEndX = CHART_ORIGIN + CHART_INNER_RADIUS * divisionStartVector.x;
    let tickEndY = CHART_ORIGIN + CHART_INNER_RADIUS * divisionStartVector.y;

    drawLine(ctx, tickStartX, tickStartY, tickEndX, tickEndY);
  }

  const drawHouseIconInDivision = (ctx, division, iconSize) => {
    let canvasMidPoint = division.canvas_start + ((division.canvas_end - division.canvas_start) / 2.0);
    let middleVectors = getUnitVectorsFromAngle(canvasMidPoint);

    let in_right_half = middleVectors.x > 0;
    let in_top_half = middleVectors.y < 0;


    // the icon needs to be centered within the outer and inner border walls
    let iconPadding = 0.20 * iconSize;
    let iconPosRadius = CHART_RADIUS - CHART_INNER_STROKE_WIDTH + iconPadding;
    let iconTopLeftX = in_right_half ? CHART_ORIGIN : CHART_ORIGIN - iconSize;
    let iconTopLeftY = in_top_half ? CHART_ORIGIN - iconSize : CHART_ORIGIN;
    let iconStartX = iconTopLeftX + iconPosRadius * middleVectors.x;
    let iconStartY = iconTopLeftY + iconPosRadius * middleVectors.y;

    let signImg = document.getElementById('ic_' + division.sign);

    // the image might not be loaded yet!
    if (signImg.complete) {
      ctx.drawImage(signImg, iconStartX, iconStartY, iconSize, iconSize);
    } else {
      // set a callback to do it
      signImg.onload = () => {
        ctx.drawImage(signImg, iconStartX, iconStartY, iconSize, iconSize);
      }
    }
  }

  const drawPlanet = (ctx, planet, planetVector, houseNum, iconSize) => {
    let in_right_half = planetVector.x > 0;
    let in_top_half = planetVector.y < 0;
    
    let CHART_INNER_RADIUS = CHART_RADIUS - CHART_INNER_STROKE_WIDTH

    let CHART_PLANET_TICK_WIDTH = CHART_INNER_STROKE_WIDTH * 0.5;

    // Position and draw the tick on the inner edge wall
    let planetTickStartX = CHART_ORIGIN + CHART_INNER_RADIUS * planetVector.x;
    let planetTickStartY = CHART_ORIGIN + CHART_INNER_RADIUS * planetVector.y;
    let planetTickEndX = CHART_ORIGIN + (CHART_INNER_RADIUS - CHART_PLANET_TICK_WIDTH) * planetVector.x;
    let planetTickEndY = CHART_ORIGIN + (CHART_INNER_RADIUS - CHART_PLANET_TICK_WIDTH) * planetVector.y;

    drawLine(ctx, planetTickStartX, planetTickStartY, planetTickEndX, planetTickEndY);

    // Draw the icon next to the tick
    let planetIconTopLeftX = in_right_half ? planetTickEndX - iconSize : planetTickEndX;
    let planetIconTopLeftY = in_top_half ? planetTickEndY : planetTickEndY - iconSize;

    let planetImg = document.getElementById('ic_' + planet.name);
    if (planetImg === null) {
       return; 
    }

    if (planetImg.complete) {
      ctx.drawImage(planetImg, planetIconTopLeftX, planetIconTopLeftY, iconSize, iconSize);
    } else {
      planetImg.onload = () => {
        ctx.drawImage(planetImg, planetIconTopLeftX, planetIconTopLeftY, iconSize, iconSize);
      }
    }
  }

  const drawAspect = (ctx, planet, aspect, planets_already_drawn, division, CHART_DIVISIONS) => {
    // The API doesn't always return "Ascendant" for the name
    let firstName = aspect.first === "Asc" ? "Ascendant" : aspect.first;
    let secondName = aspect.second === "Asc" ? "Ascendant" : aspect.second;

    let CHART_INNER_RADIUS = CHART_RADIUS - CHART_INNER_STROKE_WIDTH
    
    if (aspect.type_name === 'conjunction') {
      // no lines needed for planets right next to each other, you know?
      return;
    }

    // If we haven't drawn the other part of this aspect yet, wait until next time
    if (!planets_already_drawn.includes(secondName)) {
      return;
    }
    
    // Draw a line from the first to the second
    let firstLocation = division.canvas_start - planet.location;
    let firstVector = getUnitVectorsFromAngle(firstLocation);

    let secondHouse = getHouseFromPlanetName(secondName);
    if (!secondHouse) {
      return;
    }

    let secondPlanet = chart.chart.planets[secondName];
    let secondHouseNum = parseInt(secondHouse.substring(5)) - 1;
    let secondDivision = CHART_DIVISIONS[secondHouseNum];
    let secondLocation = secondDivision.canvas_start - secondPlanet.planet.signlon;
    let secondVector = getUnitVectorsFromAngle(secondLocation);

    // How far out from center should the line go?
    let ASPECT_LINE_RADIUS = CHART_INNER_RADIUS * 0.75;

    let lineStartX = CHART_ORIGIN + ASPECT_LINE_RADIUS * firstVector.x;
    let lineStartY = CHART_ORIGIN + ASPECT_LINE_RADIUS * firstVector.y;

    let lineEndX = CHART_ORIGIN + ASPECT_LINE_RADIUS * secondVector.x;
    let lineEndY = CHART_ORIGIN + ASPECT_LINE_RADIUS * secondVector.y;
    
    var strokeStyle = '';
    // skipping conjunctions since we don't need colors since we're not drawing lines for them
    if (aspect.type_name == "trine") {
      strokeStyle = "#58A054"; //green
    }
    if (aspect.type_name == "sextile") {
      strokeStyle = "#91B9BB"; //light blue-green
    }
    if (aspect.type_name == "opposition") {
      strokeStyle = "#F49DF5"; //light purple
    }
    if (aspect.type_name == "square") {
      strokeStyle = "#FD500B"; //dark orange
    }

    drawStyledLine(ctx, lineStartX, lineStartY, lineEndX, lineEndY, strokeStyle);
  }

  const processChartDivisions = () => {
    let chartData = chart.chart;

    let res = [];
    
    let ascendantLocation = chartData.planets['Ascendant'].planet.signlon;

    for (var i = 0; i < 12; i++) {
      let house_key = "House" + (i + 1);
      var house = chartData.houses[house_key];
      
      // these coords are in context of starting at -x going counter-clockwise
      var beginChartDegree = -i * 30 + ascendantLocation;
      var endChartDegree = (-i * 30) - 30 + ascendantLocation;
      
      // and these are the actual <canvas> coords, prolly a better way to do this translation
      var beginCanvasDegree = 180 + beginChartDegree;
      var endCanvasDegree = 180 + endChartDegree;
      
      if (beginCanvasDegree >= 360) {
        beginCanvasDegree -= 360;
        endCanvasDegree -= 360;
      }
            
      let planets = findPlanetsInHouse(house_key);
      
      res.push({sign: house.sign, planets: planets, canvas_start: beginCanvasDegree, canvas_end: endCanvasDegree, house: house_key});
    }
        
    return res;
  }

  const findPlanetsInHouse = (house_key) => {
    let chartData = chart.chart;
    var planets = [];
    
    for(var planet_name of Object.keys(chartData.planets)) {
      let planet = chartData.planets[planet_name];
      if (planet.house === house_key) {
        let aspects = planet.aspects;
        let planetName = planet.planet.id == "Asc" ? "Ascendant" : planet.planet.id;
        planets.push({sign: planet.planet.sign, name: planetName, location: planet.planet.signlon, aspects: aspects});
      }
    }
    
    return planets;
  }
  
  const getHouseInSign = (sign) => {
    let houses = chart.chart.houses;
    
    for (var house_name of Object.keys(houses)) {
      let house = houses[house_name];
      if (house.sign === sign) {
        return house;
      }
    }
  }
  
  const getHouseFromPlanetName = (planetName) => {
    let planets = chart.chart.planets;

    for (var planet_name of Object.keys(planets)) {
      if (planet_name == planetName) {
        return planets[planet_name].house;
      }
    }
  }
  
  const getUnitVectorsFromAngle = (angle) => {
    let theta = angle * Math.PI / 180.0;
    return {
      x: Math.cos(theta),
      y: Math.sin(theta)
    };
  }


  var contents;
  if (chart && chart.person) {    
    let sign_icon_rows = Object.keys(SIGNS_WITH_INFO).map((key) => {
      return (
        <img key={'sign_ic_' + key} id={'ic_' + key} src={SIGNS_WITH_INFO[key]['icon']} width="80" height="80" />
      )
    });
    
    let planet_icon_rows = Object.keys(PLANETS_WITH_INFO).map((key) => {
      return (
        <img key={'planet_ic_' + key} id={'ic_' + key} src={PLANETS_WITH_INFO[key]['icon']} width="80" height="80" />
      )
    });
    
    contents = (
      <div style={{textAlign: 'center'}}>
        <canvas id="chartCanvas" width={CANVAS_SIZE} height={CANVAS_SIZE} />
        <div style={{display: 'none'}}>
          {sign_icon_rows}
          {planet_icon_rows}
        </div>
      </div>
    );
  } else {
    contents = (
      <p>No chart</p>
    );
  }
  
  return (
    <div className='chart'>
      {contents}
    </div>
  )
}

export default Chart
