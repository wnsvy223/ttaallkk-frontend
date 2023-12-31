/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from 'react';

// material ui
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Box,
  Typography,
  Stack
} from '@material-ui/core';

// iconify
import { Icon } from '@iconify/react';
import imageFill from '@iconify/icons-eva/image-fill';
import infoFill from '@iconify/icons-eva/info-fill';

// hook
import useRequest from '../../../hook/useRequest';

// api
import { request } from '../../../api/axios/axios';

// utils
import { extractImageFromContent } from '../../../utils/markdownUtil';

export default function AppTodayImgVideo() {
  const url = `/api/post/today`;
  const fetcher = () => request.get(url).then((res) => res.data);
  const { data, isError } = useRequest(url, fetcher);
  const [image, setImage] = useState('');

  useEffect(() => {
    console.log(extractImageFromContent(data?.content));
    setImage(extractImageFromContent(data?.content));
  }, [data?.content]);

  return (
    <Card>
      <CardHeader
        title="오늘의 사진과 동영상"
        titleTypographyProps={{ variant: 'subtitle2' }}
        sx={{ backgroundColor: 'purple.lighter', pt: 1.5, pb: 1 }}
      />
      <CardContent>
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
            {image?.length > 0 ? (
              <Box>
                <Typography variant="body2" component="p">
                  {`제목 : ${data?.title}`}
                </Typography>
                <Stack spacing={1} alignItems="center" justifyContent="center">
                  {image?.map((img) => (
                    <CardMedia
                      key={img}
                      component="img"
                      image={img}
                      alt="Today image and video"
                      sx={{ borderRadius: 2, width: '30%' }}
                    />
                  ))}
                </Stack>
              </Box>
            ) : (
              <Box
                sx={{
                  height: '200px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Box
                  component={Icon}
                  icon={imageFill}
                  sx={{
                    minWidth: 40,
                    minHeight: 40,
                    color: 'GrayText'
                  }}
                />
              </Box>
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
