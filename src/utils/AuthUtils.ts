/* eslint-disable @typescript-eslint/no-explicit-any */
export function decodeToken(str: string) {
  str = str.split('.')[1];

  str = str.replace(/-/g, '+');
  str = str.replace(/_/g, '/');
  switch (str.length % 4) {
    case 0:
      break;
    case 2:
      str += '==';
      break;
    case 3:
      str += '=';
      break;
    default:
      // eslint-disable-next-line no-throw-literal
      throw 'Invalid token';
  }

  str = decodeURIComponent(escape(atob(str)));

  str = JSON.parse(str);
  return str;
}

export function isTokenValid(_token: any) {
  if (_token && Object.keys(_token).length > 0) {
    const time = new Date().getTime() / 1000;
    if (!_token.exp || _token.exp < time) {
      return false;
    } else {
      return true;
    }
  }
}

export const isAutherized = (tokenObj: any, roles?: any) => {
  if (tokenObj && isTokenValid(tokenObj)) {
    if (roles) {
      return roles.some((r: any) => {
        const realm = tokenObj.realm_access.roles.includes(r); // keycloak.hasRealmRole(r);
        const resource = tokenObj.resource_access.account.roles.includes(r);
        return realm || resource;
      });
    } else {
      return true;
    }
    // return true;
  }
  return false;
};
