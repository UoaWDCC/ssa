import SignInForm from './_components/SignInForm'

interface Props {
  searchParams: Promise<{ new?: string; google?: string }>
}

export default async function SignInPage({ searchParams }: Readonly<Props>) {
  const params = await searchParams
  const isNewAccount = params.new === '1'
  const googleError =
    params.google === 'no_account'
      ? 'No account found for that Google account. Please sign up first.'
      : undefined

  return (
    <main className="flex min-h-screen items-center justify-center bg-ssa-background px-4 pt-[88px]">
      <SignInForm isNewAccount={isNewAccount} googleError={googleError} />
    </main>
  )
}
