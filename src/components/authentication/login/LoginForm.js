import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { signInUser } from '../../../redux/actions/userAction';
import storage from '../../../utils/storage';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('이메일 형식이 아니에요 :(').required('이메일을 입력해 주세요'),
    password: Yup.string().required('비밀번호를 입력해 주세요')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: (account, { setSubmitting }) => {
      signIn(account, setSubmitting); // Formik 라이브러리에서 제공되는 onSubmit함수에 인자값으로 form input값을 가져와서 로그인처리
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  // 로그인
  const signIn = (account, setSubmiting) => {
    const body = {
      email: account.email,
      password: account.password
    };
    dispatch(signInUser(body))
      .then((res) => {
        if (res) {
          if (account.remember) {
            storage.set('user', res);
          }
          setSubmiting(false);
          navigate('/dashboard', { replace: true });
          toast.success('로그인 성공', {
            position: toast.POSITION.TOP_CENTER
          });
        }
      })
      .catch((e) => {
        console.log(`로그인 오류 : ${JSON.stringify(e)}`);
        setSubmiting(false);
        toast.error('로그인 실패', {
          position: toast.POSITION.TOP_CENTER
        });
      });
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
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
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="로그인 상태 유지"
          />

          <Link underline="none" component={RouterLink} variant="subtitle2" to="#">
            비밀번호를 잊으셨나요?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          LOGIN
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
