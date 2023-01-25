export const getChart = async (year, month, day, hour, min, sec, location) => {
  const encodedParams = new URLSearchParams();
  encodedParams.set('name', 'Test');
  encodedParams.set('date_year', year);
  encodedParams.set('date_month', month);
  encodedParams.set('date_day', day);
  encodedParams.set('date_hour', hour);
  encodedParams.set('date_min', min);
  encodedParams.set('location_lat', location.geo[0]);
  encodedParams.set('location_lon', location.geo[1]);
  encodedParams.set('location_utc_offset', location['utc_offset']);

  let options = {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: encodedParams
  };

  const res = await fetch('https://api.natalcharts.app/chart', options)
  const json = await res.json()
  return json
}

export const getLocation = async (query) => {
  const encodedParams = new URLSearchParams();
  encodedParams.set('q', query);

  let options = {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: encodedParams
  };

  const res = await fetch("https://api.natalcharts.app/geocode", options)
  const json = await res.json()
  return json
}