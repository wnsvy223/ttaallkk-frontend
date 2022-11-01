import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  TextField,
  Stack,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  FormHelperText
} from '@material-ui/core';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@material-ui/lab';
import edit2Outline from '@iconify/icons-eva/edit-2-outline';
import closeOutline from '@iconify/icons-eva/close-outline';
import styled from 'styled-components';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// api
import { request } from '../api/axios/axios';

// components
import Page from '../components/Page';
import BoardEditor from '../components/_dashboard/board/BoardEditor';

// utils
import { convertImgMarkdownToHtml } from '../utils/markdownUtil';

// ----------------------------------------------------------------------

const EditBlock = styled.div`
  .wrapper-class {
    width: 100%;
    margin: 0 auto;
    margin-bottom: 4rem;
  }
  .editor {
    height: 500px !important;
    border: 1px solid #f1f1f1 !important;
    padding: 5px !important;
    border-radius: 2px !important;
    margin-top: 20px;
  }
`;

export default function PostEditor() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = useSelector((store) => store.auth.user);
  const editorRef = useRef();
  const [category, setCategory] = useState(state?.category); // 해당 카테고리 게시판에서 에디터 랜더링 시 초기 카테고리 선택값은 해당 게시판
  const [selectError, setSelectError] = useState(false);

  const PostSchema = Yup.object().shape({
    title: Yup.string().required('제목을 입력해 주세요')
  });

  const formik = useFormik({
    initialValues: {
      title: ''
    },
    validationSchema: PostSchema,
    onSubmit: (postData, { setSubmitting }) => {
      const editorInstance = editorRef.current?.getInstance();
      const markdown = editorInstance?.getMarkdown();
      const html = editorInstance?.getHTML();
      const convertContent = convertImgMarkdownToHtml(markdown, html);
      const body = {
        writeUid: user.uid,
        categoryId: category,
        title: postData.title,
        content: convertContent
      };
      createPost(body, setSubmitting);
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleCancel = () => {
    navigate(-1);
  };

  const createPost = (body, setSubmitting) => {
    request
      .post(`/api/post`, body)
      .then((res) => {
        if (res?.data?.status === 200) {
          navigate(-1);
          setSubmitting(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setSubmitting(false);
      });
  };

  const handleSelect = (event) => {
    setCategory(event.target.value);
  };

  const handleSelectClose = (event) => {
    if (event.target.value === undefined && !category) {
      setSelectError(true);
    } else {
      setSelectError(false);
    }
  };

  return (
    <Page title="Board: Edit | TTAALLKK">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          글 작성
        </Typography>
        <Card sx={{ height: '90%', p: { xs: 2, md: 8 } }}>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <FormControl fullWidth color="purple" error={selectError} size="small">
                  <InputLabel id="category-select-label" sx={{ fontSize: 13 }}>
                    카테고리
                  </InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category"
                    name="category"
                    value={category}
                    label="카테고리"
                    sx={{ fontSize: 13 }}
                    onChange={handleSelect}
                    onClose={handleSelectClose}
                  >
                    <MenuItem value={1}>자유 게시판</MenuItem>
                    <MenuItem value={2}>대화 게시판</MenuItem>
                    <MenuItem value={3}>Tech & Tip</MenuItem>
                    <MenuItem value={4}>홍보 게시판</MenuItem>
                  </Select>
                  {selectError && <FormHelperText>카테고리를 선택해 주세요</FormHelperText>}
                </FormControl>
                <TextField
                  fullWidth
                  size="small"
                  type="title"
                  autoComplete="title"
                  label="제목"
                  color="purple"
                  {...getFieldProps('title')}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                  InputProps={{
                    style: { fontSize: '13px' }
                  }}
                  InputLabelProps={{
                    style: { fontSize: '13px' }
                  }}
                />
                <EditBlock>
                  <BoardEditor editorRef={editorRef} height="600px" />
                </EditBlock>
                <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }}>
                  <LoadingButton
                    sx={{ mr: 2 }}
                    variant="contained"
                    color="purple"
                    type="submit"
                    loading={isSubmitting}
                    startIcon={<Icon icon={edit2Outline} />}
                  >
                    등록
                  </LoadingButton>
                  <Button
                    variant="contained"
                    color="purple"
                    type="button"
                    onClick={handleCancel}
                    startIcon={<Icon icon={closeOutline} />}
                  >
                    취소
                  </Button>
                </Box>
              </Stack>
            </Form>
          </FormikProvider>
        </Card>
      </Container>
    </Page>
  );
}
