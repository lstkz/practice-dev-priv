import React from 'react';
import { Button } from '../../components/Button';
import 'twin.macro';
import { createUrl } from '../../common/url';
import { Logo } from '../../components/Logo';

export function LandingHeader() {
  return (
    <nav
      className="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6"
      aria-label="Global"
    >
      <div className="flex items-center flex-1">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Logo />
        </div>
      </div>
      <div className=" flex">
        <Button
          href={createUrl({
            name: 'login',
          })}
          tw="ml-2"
          type="gray"
          focusBg="gray-800"
        >
          Log in
        </Button>
      </div>
    </nav>
  );
}
