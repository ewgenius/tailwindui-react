import * as React from 'react'
import { NextApiRequest } from 'next'
import Error from 'next/error'
import Head from 'next/head'
import Link from 'next/link'

import { ExamplesType, resolveAllExamples } from '../playground-utils/resolve-all-examples'

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  return {
    props: {
      allExamples: await resolveAllExamples('pages'),
      examples: await resolveAllExamples('pages', ...req.url.split('/').slice(1)),
    },
  }
}

export default function Page(props: { examples: false | ExamplesType[] }) {
  if (props.examples === false) {
    return <Error statusCode={404} />
  }

  return (
    <>
      <Head>
        <title>Examples</title>
      </Head>

      <div className="container my-24">
        <div className="prose">
          <h2>Examples</h2>
          <Examples examples={props.examples} />
        </div>
      </div>
    </>
  )
}

export function Examples(props: { examples: ExamplesType[] }) {
  return (
    <ul>
      {props.examples.map(example => (
        <li key={example.path}>
          {example.children ? (
            <h3 className="text-xl capitalize">{example.name}</h3>
          ) : (
            <Link href={example.path}>
              <a className="capitalize">{example.name}</a>
            </Link>
          )}
          {example.children && <Examples examples={example.children} />}
        </li>
      ))}
    </ul>
  )
}
