var
  BROWSER_FIREFOX = 'Firefox',
  BROWSER_CHROME = 'Chrome';

function getDesktop(browser, version) {
  return {
    base: 'BrowserStack',
    browser: browser,
    browser_version: version.toString() + '.0',
    os: 'OS X',
    os_version: (version < 25) ? 'Snow Leopard' : 'Sierra'
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
  bs_firefox_mac: getDesktop(BROWSER_FIREFOX, 54),
  bs_firefox_mac_old: getDesktop(BROWSER_FIREFOX, 21),
  bs_chrome_mac: getDesktop(BROWSER_CHROME, 59),
  // bs_chrome_mac_old: getDesktop(BROWSER_CHROME, 16), <-- issues testing Push on old Chrome versions in BrowserStack
  // bs_firefox_mobile: getMobile(BROWSER_CHROME) <-- can't work because of HTTPS requirement (wth dude)
};
