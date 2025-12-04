javascript:(function() {
  /* @title: Visualize Strava Performance Trends */
  /* @description: Creates visual performance trend analysis with fitted curves for recent Strava efforts */
  /* @domains: strava.com */
  /* Visualizes performance trends on Strava segment history charts by adding a linear regression line and improvement rate calculation. */
  /* E.g. https://www.strava.com/segments/38142135 -- result: https://imgur.com/a/nwlu1Es */
  
  /* Simple polynomial regression implementation */
  function polyRegression(points, degree) {
      const n = points.length;
      const xSum = points.reduce((sum, p) => sum + p.x, 0);
      const ySum = points.reduce((sum, p) => sum + p.y, 0);
      const xySum = points.reduce((sum, p) => sum + p.x * p.y, 0);
      const x2Sum = points.reduce((sum, p) => sum + p.x * p.x, 0);
      
      const m = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
      const b = (ySum - m * xSum) / n;
      
      return {m, b};
  }

  /* Extract data points from SVG circles */
  function extractDataPoints() {
      const circles = document.querySelectorAll('circle.mark:not(.personal-best-mark)');
      const points = [];
      
      circles.forEach(circle => {
          const x = parseFloat(circle.getAttribute('cx'));
          const y = parseFloat(circle.getAttribute('cy'));
          if (!isNaN(x) && !isNaN(y)) {
              points.push({x, y});
          }
      });
      
      return points;
  }

  /* Create SVG path for the fit curve */
  function createFitCurvePath(points, reg) {
      const sortedPoints = [...points].sort((a, b) => a.x - b.x);
      const start = sortedPoints[0].x;
      const end = sortedPoints[sortedPoints.length - 1].x;
      
      let d = `M ${start} ${reg.m * start + reg.b}`;
      for (let x = start; x <= end; x += (end - start) / 100) {
          const y = reg.m * x + reg.b;
          d += ` L ${x} ${y}`;
      }
      
      return d;
  }

  /* Main execution */
  try {
      /* Find the correct SVG and group */
      const svg = document.querySelector('#athlete-history-chart svg');
      if (!svg) throw new Error('Chart SVG not found');

      const transformedGroup = svg.querySelector('g[transform^="translate"]');
      if (!transformedGroup) throw new Error('Main group not found');

      const points = extractDataPoints();
      if (points.length < 2) throw new Error('Insufficient data points');

      const regression = polyRegression(points, 1);
      
      /* Create the fit curve path */
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', createFitCurvePath(points, regression));
      path.setAttribute('stroke', '#FF4444');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-dasharray', '5,5');
      path.setAttribute('class', 'trend-line');
      
      /* Add path to SVG */
      transformedGroup.appendChild(path);
      
      /* Add legend text */
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '100');
      text.setAttribute('y', '20');
      text.setAttribute('fill', '#FF4444');
      text.setAttribute('class', 'trend-label');
      text.textContent = 'Trend Line';
      transformedGroup.appendChild(text);

      /* Calculate and display slope */
      const slopeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const timePerMonth = regression.m * -1 * (3600 / points[points.length - 1].x) * 30;  /* Convert to minutes per month */
      slopeText.setAttribute('x', '100');
      slopeText.setAttribute('y', '40');
      slopeText.setAttribute('fill', '#FF4444');
      slopeText.setAttribute('class', 'trend-slope');
      slopeText.textContent = `${timePerMonth.toFixed(1)} sec/month improvement`;
      transformedGroup.appendChild(slopeText);

  } catch (error) {
      alert('Error: ' + error.message);
})();
})();
