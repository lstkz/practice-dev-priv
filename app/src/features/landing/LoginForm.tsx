import { Button } from '../../components/Button';
import 'twin.macro';
import React from 'react';
import { Input } from '../../components/Input';
import { Separator } from '../../components/Separator';
import { GoogleIcon } from '../../icons/GoogleIcon';
import { GithubIcon } from '../../icons/GithubIcon';

export function LoginForm() {
  return (
    <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
      <div className="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden">
        <div className="px-4 py-8 sm:px-10">
          <div>
            <p className="text-sm font-medium text-gray-700">Sign in with</p>

            <div className="mt-1 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <GoogleIcon className="w-5 h-5" />
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with GitHub</span>
                  <GithubIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <Separator tw="mt-6">Or</Separator>

          <div className="mt-6">
            <form action="#" method="POST" className="space-y-6">
              <Input
                label="Username"
                name="username"
                placeholder="Username"
                noLabel
                autoComplete="name"
              />
              <Input
                label="Email"
                name="email"
                placeholder="Email"
                noLabel
                autoComplete="email"
              />
              <Input
                label="Password"
                name="password"
                placeholder="Password"
                noLabel
                autoComplete="current-password"
              />
              <div>
                <Button type="primary" block>
                  Create your account
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className="px-4 py-6 bg-gray-50 border-t-2 border-gray-200 sm:px-10">
          <p className="text-xs leading-5 text-gray-500">
            By signing up, you agree to our{' '}
            <a href="#" className="font-medium text-gray-900 hover:underline">
              Terms
            </a>
            ,{' '}
            <a href="#" className="font-medium text-gray-900 hover:underline">
              Data Policy
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-gray-900 hover:underline">
              Cookies Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
