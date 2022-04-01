console.log('init background.js');
const getMethodUrl = (methodName: string, parameters: any) => {
  if (methodName === undefined) {
    return '';
  }
  const proxyPath = 'https://sandbox7.feedly.com';
  let methodUrl = proxyPath + methodName;

  let queryString = '?';
  for (let parameterName in parameters) {
    queryString += parameterName + '=' + parameters[parameterName] + '&';
  }

  let browserPrefix;
  // @if BROWSER='chrome'
  browserPrefix = 'c';
  // @endif

  // @if BROWSER='opera'
  browserPrefix = 'o';
  // @endif

  // @if BROWSER='firefox'
  browserPrefix = 'f';
  // @endif

  queryString += 'av=' + browserPrefix + 3;

  methodUrl += queryString;

  chrome.tabs.create({ url: methodUrl }, () => {
    console.log('create tab success');
    const processCode = async (tabId: number, information: chrome.tabs.TabChangeInfo, tab: any) => {
      if (!information.url) {
        return;
      }
      const newUrl = new URL(information.url || '');
      const tempCode = newUrl.searchParams.get('code');
      console.log(tempCode);
      if (tempCode) {
        const res = await fetch(proxyPath + '/v3/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({
            code: tempCode,
            client_id: 'sandbox',
            client_secret: '7x7xWjaq0u6Jguw4weEeCM9tyVsLwTPc',
            redirect_uri: 'http://localhost:8080',
            grant_type: 'authorization_code',
            state: new Date().getTime(),
          }),
        })
          .then((response) => response.json())
          .then((response: any) => {
            console.log('response', response);
            chrome.storage.sync.set({
              accessToken: response.access_token,
              refreshToken: response.refresh_token,
              feedlyUserId: response.id,
            });
            chrome.tabs.onUpdated.removeListener(processCode);
          });
      }
    };
    chrome.tabs.onUpdated.addListener(processCode);
  });
};
chrome.runtime.onInstalled.addListener(() => {
  // TODO 未登录或者请求401需要重新获取token
  if (chrome.storage) {
    chrome.storage.sync.get(['accessToken'], (result) => {
      console.log(result.accessToken);
      if (!result.accessToken) {
        getMethodUrl('/auth/auth', {
          response_type: 'code',
          client_id: 'sandbox',
          client_secret: '7x7xWjaq0u6Jguw4weEeCM9tyVsLwTPc',
          redirect_uri: 'http://localhost:8080',
          scope: 'https://cloud.feedly.com/subscriptions',
          state: new Date().getTime(),
        });
      }
    });
    // chrome.action.setBadgeText({ text: "999" });
  }
});
