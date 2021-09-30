// material
import { Card, CardHeader, CardContent, CardActions, Button } from '@material-ui/core';

// component

// hook
import useRequest from '../../../hook/useRequest';
// api
import { request } from '../../../api/axios/axios';

// ----------------------------------------------------------------------

export default function AppAdminNotice() {
  const url = `/api/post/notice`;
  const fetcher = () => request.get(url).then((res) => res.data);
  const { data, isError } = useRequest(url, fetcher);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <CardHeader
        title="최신 공지글 입니다."
        titleTypographyProps={{ variant: 'subtitle2' }}
        sx={{ backgroundColor: 'primary.lighter', pt: 1.5, pb: 1 }}
      />
      {isError ? (
        <CardContent>오류가 발생하였습니다.</CardContent>
      ) : (
        <CardContent>{data?.length > 0 ? data : '공지 사항이 없습니다.'}</CardContent>
      )}
      <CardActions sx={{ justifyContent: 'end' }}>
        <Button size="small" sx={{ color: 'GrayText' }}>
          자세히
        </Button>
      </CardActions>
    </Card>
  );
}
