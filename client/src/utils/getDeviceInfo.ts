export const getDeviceInfo = (): string => {
  const userAgent = navigator.userAgent;
  let browserName = "Unknown Browser";
  let browserVersion = "Unknown Version";
  let osName = "Unknown OS";
  let osVersion = "";

  // Detect Browser
  if (userAgent.indexOf("Firefox") > -1) {
    browserName = "Firefox";
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : "Unknown";
  } else if (userAgent.indexOf("Edg") > -1) {
    browserName = "Edge";
    const match = userAgent.match(/Edg\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : "Unknown";
  } else if (userAgent.indexOf("Chrome") > -1) {
    browserName = "Chrome";
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : "Unknown";
  } else if (userAgent.indexOf("Safari") > -1) {
    browserName = "Safari";
    const match = userAgent.match(/Version\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : "Unknown";
  } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    browserName = "Opera";
    const match = userAgent.match(/(?:Opera|OPR)\/(\d+\.\d+)/);
    browserVersion = match ? match[1] : "Unknown";
  }

  // Detect OS
  if (userAgent.indexOf("Android") > -1) {
    osName = "Android";
    const match = userAgent.match(/Android (\d+(?:\.\d+)?)/);
    osVersion = match ? match[1] : "";
  } else if (
    userAgent.indexOf("iPhone") > -1 ||
    userAgent.indexOf("iPad") > -1
  ) {
    osName = "iOS";
    const match = userAgent.match(/OS (\d+(?:_\d+)?)/);
    if (match) {
      osVersion = match[1].replace(/_/g, ".");
    }
  } else if (userAgent.indexOf("Win") > -1) {
    osName = "Windows";
    if (userAgent.indexOf("Windows NT 10.0") > -1) osVersion = "10";
    else if (userAgent.indexOf("Windows NT 6.3") > -1) osVersion = "8.1";
    else if (userAgent.indexOf("Windows NT 6.2") > -1) osVersion = "8";
    else if (userAgent.indexOf("Windows NT 6.1") > -1) osVersion = "7";
  } else if (userAgent.indexOf("Mac") > -1) {
    osName = "macOS";
    const match = userAgent.match(/Mac OS X (\d+[._]\d+(?:[._]\d+)?)/);
    if (match) {
      osVersion = match[1].replace(/_/g, ".");
    }
  } else if (userAgent.indexOf("Linux") > -1) {
    osName = "Linux";
  }

  // Format the device info string
  const osInfo = osVersion ? `${osName} ${osVersion}` : osName;
  return `${browserName} ${browserVersion} on ${osInfo}`;
};
