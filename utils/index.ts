interface ICookieInfo {
  userId?: string;
  nickname?: string;
  avatar?: string;
  expiresDate?: Date
}

export const setCookie = (
  cookies: any,
  { userId = '', nickname = '', avatar = '', expiresDate }: ICookieInfo
) => {
  const expires = expiresDate || new Date(Date.now() + 24 * 3600 * 1000);
  const path = '/';

  cookies.set('userId', userId, { path, expires });

  cookies.set('nickname', nickname, { path, expires });

  cookies.set('avatar', avatar, { path, expires });
};