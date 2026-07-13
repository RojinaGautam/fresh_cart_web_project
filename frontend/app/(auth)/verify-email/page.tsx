import VerifyEmailView from "./VerifyEmailView";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return <VerifyEmailView initialEmail={email || ""} />;
}
