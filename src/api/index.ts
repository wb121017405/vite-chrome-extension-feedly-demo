import service from '@/utils/request';

export const getAuthUrl = (data: any) => {
  return service({
    url: '/auth/auth',
    method: 'get',
    params: data,
  });
};
