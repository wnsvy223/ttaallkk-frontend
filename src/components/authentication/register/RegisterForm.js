import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { signUpUser } from '../../../api/action/userAction';
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const RegisterSchema = Yup.object().shape({
    nickName: Yup.string()
      .min(2, '닉네임이 너무 짧아요!')
      .max(50, '닉네임이 너무 길어요!')
      .required('닉네임을 입력해 주세요.'),
    email: Yup.string().email('이메일 형식이 아니에요 :(').required('이메일을 입력해 주세요'),
    password: Yup.string().required('비밀번호를 입력해 주세요')
  });

  const formik = useFormik({
    initialValues: {
      nickName: '',
      email: '',
      password: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (account, { setSubmitting }) => {
      signUp(account, setSubmitting);
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  // 회원가입
  const signUp = (account, setSubmiting) => {
    const body = {
      displayName: account.nickName,
      email: account.email,
      password: account.password
    };
    dispatch(signUpUser(body))
      .then((res) => {
        if (res) {
          setSubmiting(false);
          navigate('/login', { replace: true });
          toast.success('회원가입 성공', {
            position: toast.POSITION.TOP_CENTER
          });
        }
      })
      .catch((e) => {
        console.log(`회원가입 오류 : ${JSON.stringify(e)}`);
        setSubmiting(false);
        toast.error('회원가입 실패', {
          position: toast.POSITION.TOP_CENTER
        });
      });
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="닉네임"
              {...getFieldProps('nickName')}
              error={Boolean(touched.nickName && errors.nickName)}
              helperText={touched.nickName && errors.nickName}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="이메일"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="비밀번호"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            SIGNUP
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
