import useSWR from 'swr';

// swr 이용한 api요청 공통 hooks
export default function useRequest(url, fetcher) {
  const config = {
    revalidateOnFocus: false, // 창이 포커싱 되었을때 요청 갱신
    shouldRetryOnError: false // fetcher에 에러가 있을 때 재시도
  };
  const { data, error } = useSWR(url, fetcher, config);

  return {
    data,
    isLoading: !error && !data,
    isError: error
  };
}
