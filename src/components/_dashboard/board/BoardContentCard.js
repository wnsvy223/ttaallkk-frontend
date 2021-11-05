/* eslint-disable react/no-danger */
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { styled } from '@material-ui/core/styles';
import {
  Typography,
  Box,
  Avatar,
  Grid,
  Stack,
  Button,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Divider
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import messageCircleFill from '@iconify/icons-eva/message-circle-fill';
import { Icon } from '@iconify/react';

import moment from 'moment';
import 'moment/locale/ko';
import { numToKorean, FormatOptions } from 'num-to-korean';

import decodeHtmlEntity from '../../../utils/decodeHtmlEntity';
import BoardPostLike from './BoardPostLike';
// ----------------------------------------------------------------------

BoardContentCard.propTypes = {
  postData: PropTypes.object.isRequired
};

const PostContentCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(4),
  borderRadius: 3
}));

const GridItemColumn = styled(Box)(() => ({
  height: '50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 5
}));

const CardUserPorifle = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'end',
  padding: 15,
  marginRight: 20
}));

const ControlButton = styled(Button)(() => ({
  backgroundColor: '#605A89',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#2E2851',
    color: '#fff'
  },
  boxShadow: '0px 2px 2px 0px rgba(152, 150, 181, 1)'
}));

export default function BoardContentCard({ postData }) {
  const user = useSelector((store) => store.auth.user);

  return (
    <PostContentCard>
      <Grid container sx={{ p: 1 }}>
        <Grid item xs={12} md={10}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ height: 50, ml: { xs: 0, md: 2 }, justifyContent: { xs: 'center', md: 'start' } }}
          >
            <Typography sx={{ fontSize: 10, color: 'text.secondary', textAlign: 'center' }}>
              {`#${postData.id}`}
            </Typography>
            <Typography noWrap sx={{ fontSize: 15, color: 'text.primary', textAlign: 'center' }}>
              {postData.title}
            </Typography>
          </Stack>
        </Grid>
        <Grid container item xs={12} md={2}>
          <Grid container direction="column">
            <GridItemColumn>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'grey.600'
                  }}
                >
                  <Box
                    component={Icon}
                    icon={messageCircleFill}
                    sx={{ width: 15, height: 15, color: 'text.secondary' }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{ ml: 0.5, fontSize: '12px', color: 'text.primary' }}
                  >
                    {numToKorean(postData.commentCnt, FormatOptions.MIXED)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'grey.600'
                  }}
                >
                  <VisibilityIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ ml: 0.5, fontSize: '12px', color: 'text.primary' }}
                  >
                    {numToKorean(postData.views, FormatOptions.MIXED)}
                  </Typography>
                </Box>
              </Stack>
            </GridItemColumn>
            <GridItemColumn>
              <Typography sx={{ fontSize: 10, color: 'text.secondary', textAlign: 'center' }}>
                {moment(postData.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Typography>
            </GridItemColumn>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <CardUserPorifle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="start"
          spacing={1}
          sx={{ maxWidth: '50%' }}
        >
          <Avatar
            alt={postData.displayName}
            src={postData.profileUrl}
            sx={{ width: 26, height: 26 }}
          />
          <Typography noWrap sx={{ fontSize: 12 }}>
            {postData.displayName}
          </Typography>
        </Stack>
      </CardUserPorifle>
      {postData.photoUrl && (
        <CardMedia
          component="img"
          width="100%"
          height="50%"
          image={postData.photoUrl}
          alt="image"
        />
      )}
      <CardContent sx={{ minHeight: 200 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          dangerouslySetInnerHTML={{ __html: decodeHtmlEntity(postData.content) }}
        />
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
        <BoardPostLike postData={postData} />
      </CardActions>
      <Divider />
      <Box sx={{ height: 70 }}>
        {postData.uid === user?.uid && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: { xs: 'center', md: 'end' } }}>
            <ControlButton variant="contained" sx={{ mr: 1 }}>
              수정
            </ControlButton>
            <ControlButton variant="contained" sx={{ ml: 1 }}>
              삭제
            </ControlButton>
          </Box>
        )}
      </Box>
    </PostContentCard>
  );
}
