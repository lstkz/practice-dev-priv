import {
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from 'shared';
import { Validator } from 'src/common/Validator';
import { useForm } from 'react-hook-form';
import { useAuthForm } from 'src/hooks/useAuthForm';
import { api } from 'src/services/api';

interface FormValues {
  email: string;
  username: string;
  password: string;
}

export function useRegisterForm() {
  const formMethods = useForm<FormValues>({
    resolver: data => {
      return new Validator(data)
        .required('email')
        .email('email')
        .required('username')
        .regex(
          'username',
          USERNAME_REGEX,
          'Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.'
        )
        .minLength('username', USERNAME_MIN_LENGTH)
        .maxLength('username', USERNAME_MAX_LENGTH)
        .required('password')
        .minLength('password', PASSWORD_MIN_LENGTH)
        .validate();
    },
  });
  const auth = useAuthForm({
    submit: () => {
      return api.user_register(formMethods.getValues());
    },
  });
  return { formMethods, ...auth };
}
