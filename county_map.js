const prefix = "./";
var mapStyle = [{
    "elementType": "labels",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": "#F2EFDF"
    }]
  },
  {
    "featureType": "poi",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "road",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "transit",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": "#91D9D9"
    }]
  }
];

function backgroundLoad(obj, json_url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', prefix + json_url);
  xhr.onload = function() {
    Object.assign(obj, JSON.parse(xhr.responseText));
  };
  xhr.send();
}

var map;
// Global read only data variables.
var stateNames = {};
var countyPolicies = {};
var statePolicies = {};


function initMap() {
  // load the map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 40,
      lng: -100
    },
    zoom: 4,
    styles: mapStyle,
    mapTypeControl: false,
    streetViewControl: false,
  });

  // set up the style rules and events for google.maps.Data
  map.data.setStyle(styleFeature);
  map.data.addListener('mouseover', mouseInToRegion);
  map.data.addListener('mouseout', mouseOutOfRegion);
  map.data.addListener('click', clickOnRegion);

  map.data.loadGeoJson(prefix + 'counties.json', {
    idPropertyName: 'AFFGEOID'
  });
  map.data.loadGeoJson(prefix + 'states.json', {
    idPropertyName: 'AFFGEOID'
  });
  backgroundLoad(stateNames, 'state_names.json');
  backgroundLoad(countyPolicies, 'county_policies.json');
  backgroundLoad(statePolicies, 'state_policies.json');
}

function styleFeature(feature) {
  if (feature.j.is_a_state) {
    return {
      strokeWeight: 1.2,
      zIndex: 1,
      visible: true,
      strokeColor: '#BFB59F',
      fillColor: '#F2EFDF'
    };
  }
  var strokeWeight = 0.08;
  var zIndex = 2;
  var opacity = 0.0;
  if (feature.getProperty('state') === 'hover') {
    strokeWeight = 0.8
    zIndex = 3;
    opacity = 0.8;
  }
  return {
    strokeWeight: strokeWeight,
    strokeColor: '#BFB59F',
    fillColor: '#F2C879',
    zIndex: zIndex,
    fillOpacity: opacity,
    visible: true,
  };
}


function mouseInToRegion(e) {
  // set the hover state so the setStyle function can change the border
  e.feature.setProperty('state', 'hover');
}

function mouseOutOfRegion(e) {
  // reset the hover state, returning the border to normal
  e.feature.setProperty('state', 'normal');
}


const policyIcons = {
  testing: "local_pharmacy",
  shelter: "home",
  school: "school",
  work: "work",
  event: "event",
  transport: "train",
}
const policyNames = {
  testing: "Testing",
  shelter: "Shelter-in-place",
  school: "School Closure",
  work: "Business Closure",
  event: "Public Event Cancellation",
  transport: "Public Transportation Shutdown",
}
const policies = Object.keys(policyIcons);

function policyActivity(policyName, policy) {
  const policyValue = policy[policyName];
  // Scale is either True/False or 1-2-3.
  if (policyValue === 1 || policyValue === false) {
    return "inactive";
  } else if (policyValue == 3 || policyValue === true) {
    return "active"
  } else if (policyValue == 2) {
    return "partial";
  } else {
    return "unknown";
  }
}

function makeIcon(policyName, policy) {
  const policyValue = policy[policyName];
  var colorStyle = policyActivity(policyName, policy) + "-policy";
  var i = document.createElement("i");
  i.className = "material-icons " + colorStyle;
  i.innerText = policyIcons[policyName];
  return i;
}

function displayPolicies(div, policy, id) {
  div.innerHTML = null;
  if (policy == null) {
    return false;
  }
  for (const policyDim of policies) {
    const icon = makeIcon(policyDim, policy);
    if (icon == null) continue;
    policyDiv = document.createElement("div");
    div.appendChild(policyDiv);
    text = document.createElement("span");
    text.className = "policy-line";
    policyDiv.appendChild(text);
    text.appendChild(icon);
    activityStr = policyActivity(policyDim, policy)
    text.innerHTML += policyNames[policyDim] + ":&nbsp";
    evidence = policy[policyDim + "_url"];
    if (evidence != null && evidence != "") {
      a = document.createElement("a");
      a.href = evidence;
      a.target = "_blank";
      a.innerText = activityStr;
      text.appendChild(a);
    } else {
      text.innerHTML += activityStr;
    }
    date = policy[policyDim + "_date"];
    if (date != null && date != "") {
      text.innerHTML += "&nbspsince&nbsp" + date;
    }
  }
  return true;
}

function clickOnRegion(e) {
  const fips_id = e.feature.j.fips_id;
  const state_id = e.feature.j.state_id;
  document.getElementById("state-name").textContent = stateNames[state_id];
  document.getElementById("county-name").textContent = e.feature.j.name + ' County ';
  if (!displayPolicies(document.getElementById('county-policies'), countyPolicies[fips_id], fips_id)) {
    var editText = document.createElement("a");
    var i = document.createElement("i");
    i.className = "material-icons";
    i.innerText = "create";
    editText.appendChild(i);
    editText.href = "https://docs.google.com/forms/d/e/1FAIpQLScO4B6PkJsOeVKM2_dbpFMhnXCfb89Kya9bWtKX4uUWIMev7Q/viewform?usp=pp_url&entry.1112165839=";
    editText.href += encodeURI(e.feature.j.name + ' County, ' + stateNames[state_id]);
    editText.target = "_blank";
    editText.innerHTML += "Submit data for this county!"
    document.getElementById('county-policies').appendChild(editText);
  }
  displayPolicies(document.getElementById('state-policies'), statePolicies[state_id], state_id);
}
