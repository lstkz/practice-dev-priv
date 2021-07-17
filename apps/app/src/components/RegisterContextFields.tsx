import React from 'react';
import { ContextInput } from './ContextInput';

export function RegisterContextFields() {
  return (
    <>
      <ContextInput
        label="Username"
        name="username"
        placeholder="Username"
        noLabel
        autoComplete="name"
        limitMax
      />
      <ContextInput
        label="Email"
        name="email"
        placeholder="Email"
        noLabel
        autoComplete="email"
        limitMax
      />
      <ContextInput
        label="Password"
        name="password"
        placeholder="Password"
        type="Password"
        noLabel
        autoComplete="current-password"
        limitMax
      />
    </>
  );
}
