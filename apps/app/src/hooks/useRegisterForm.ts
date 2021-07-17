import {
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from 'shared';
import { Validator } from 'src/common/Validator';
import { useForm } from 'react-hook-form';
import { useAuthForm } from 'src/hooks/useAuthForm';
import { gql } from '@apollo/client';
import { useRegisterMutation } from 'src/generated';

interface FormValues {
  email: string;
  username: string;
  password: string;
}

gql`
  mutation Register($registerValues: RegisterInput!) {
    register(values: $registerValues) {
      ...DefaultAuthResult
    }
  }
  fragment DefaultAuthResult on AuthResult {
    token
    user {
      ...allUserProps
    }
  }
`;

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
  const [register] = useRegisterMutation();
  const auth = useAuthForm({
    submit: () => {
      return register({
        variables: {
          registerValues: formMethods.getValues(),
        },
      }).then(x => x.data!.register!);
    },
  });
  return { formMethods, ...auth };
}
