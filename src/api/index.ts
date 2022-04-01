import service from '@/utils/request';

export const getMarkersCounts = (data?: any) => {
  return service({
    url: '/v3/markers/counts',
    method: 'get',
    params: data,
  });
};
export const getFeedStreams = (data?: any) => {
  return service({
    url: '/v3/streams/contents',
    method: 'get',
    params: data,
  });
};
