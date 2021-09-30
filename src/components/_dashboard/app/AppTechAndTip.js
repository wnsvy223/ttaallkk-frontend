// material
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Box,
  Typography
} from '@material-ui/core';
//
import { Icon } from '@iconify/react';
import imageFill from '@iconify/icons-eva/image-fill';
import infoFill from '@iconify/icons-eva/info-fill';

// ----------------------------------------------------------------------

// hook
import useRequest from '../../../hook/useRequest';
// api
import { request } from '../../../api/axios/axios';

export default function AppTechAndTip() {
  const url = `/api/post/tip`;
  const fetcher = () => request.get(url).then((res) => res.data);
  const { data, isError } = useRequest(url, fetcher);

  return (
    <Card>
      <CardHeader
        title="Tech & Tip"
        titleTypographyProps={{ variant: 'subtitle2' }}
        sx={{ backgroundColor: 'secondary.light', pt: 1.5, pb: 1 }}
      />
      <CardContent
        sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isError ? (
          <Box
            component={Icon}
            icon={infoFill}
            sx={{
              minWidth: 40,
              minHeight: 40,
              color: 'error.main'
            }}
          />
        ) : (
          <Box>
            {data?.length > 0 ? (
              <Box sx={{ height: 250, overflow: 'auto', p: 3 }}>
                <img src={data.imagUrl} alt={data.imagUrl} />
                <Typography>{data.content}</Typography>
              </Box>
            ) : (
              <Box
                component={Icon}
                icon={imageFill}
                sx={{
                  minWidth: 40,
                  minHeight: 40,
                  color: 'GrayText'
                }}
              />
            )}
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'end' }}>
        <Button size="small" sx={{ color: 'GrayText' }}>
          자세히
        </Button>
      </CardActions>
    </Card>
  );
}
