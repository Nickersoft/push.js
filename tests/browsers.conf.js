var
  BROWSER_FIREFOX = 'Firefox',
  BROWSER_CHROME = 'Chrome',
  BROWSER_EDGE = 'Edge',
  BROWSER_IE = 'ie',
  BROWSER_OPERA = 'Opera',
  BROWSER_SAFARI = 'Safari';

function getWindowsDesktop(browser, version) {
  return {
    base: 'BrowserStack',
    browser: browser,
    browser_version: version.toString() + '.0',
    os: 'Windows',
    os_version: '10'
  }
}

function getOSXDesktop(browser, version, os) {
  var rounded;

  if (!os)
    os = (version < 25) ? 'Snow Leopard' : 'Sierra';

  rounded = Math.floor(version);

  if (version == rounded)
    version = version.toString() + '.0';

  return {
    base: 'BrowserStack',
    browser: browser,
    browser_version: version,
    os: 'OS X',
    os_version: os
  }
}

function getMobile(browser) {
  return {
    base: 'BrowserStack',
    real_mobile: true,
    device: 'Google Pixel',
    browser: 'Mobile ' + browser,
    os: 'android',
    os_version: '7.1'
  }
}

module.exports = {
  bs_firefox_mac: getOSXDesktop(BROWSER_FIREFOX, 54),
  bs_firefox_mac_old: getOSXDesktop(BROWSER_FIREFOX, 21),
  bs_chrome_mac: getOSXDesktop(BROWSER_CHROME, 59),
  bs_edge_win: getWindowsDesktop(BROWSER_EDGE, 15),
  bs_safari_mac: getOSXDesktop(BROWSER_SAFARI, 10.1, 'Sierra'),
  bs_opera_mac: getOSXDesktop(BROWSER_OPERA, 46),
  // bs_chrome_mac_old: getOSXDesktop(BROWSER_CHROME, 16), <-- issues testing Push on old Chrome versions in BrowserStack
  // bs_firefox_mobile: getMobile(BROWSER_CHROME) <-- can't work because of HTTPS requirement (wth dude)
};
