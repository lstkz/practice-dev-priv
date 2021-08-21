import React from 'react';
import { Container } from 'src/components/Container';
import Dashboard from 'src/components/Dashboard';
import tw, { styled } from 'twin.macro';

const Wrapper = styled.div`
  ${tw`text-gray-600 text-sm`}
  h1 {
    ${tw`text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl`}
  }
  h2 {
    ${tw`text-lg leading-8 font-bold text-gray-900 mt-4 mb-1`}
  }
  h3 {
    ${tw`text-base leading-8 font-bold text-gray-900 mt-4 mb-1`}
  }
  p {
    ${tw`my-1`}
  }
  ol {
  }
  li {
    ${tw`ml-10  list-decimal`}
  }
  a {
    ${tw`text-blue-500`}
  }
  strong {
    ${tw`font-semibold`}
  }
  table {
    ${tw`my-2`}
  }
  th,
  td {
    ${tw`text-left`}
  }
`;

export function ContactMail() {
  return <a href="mailto:contact@practice.dev">contact@practice.dev</a>;
}

interface TermsPageProps {
  title: string;
  date: string;
  children: React.ReactNode;
}

export function LegalPage(props: TermsPageProps) {
  const { children, date, title } = props;
  return (
    <Dashboard>
      <Wrapper>
        <Container>
          <h1>{title}</h1>
          <p>Last updated {date}</p>
          {children}
        </Container>
      </Wrapper>
    </Dashboard>
  );
}
