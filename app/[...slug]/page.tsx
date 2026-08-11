import SiteApp from "../site-app";

export default async function RoutedPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return <SiteApp path={`/${slug.join("/")}`} />;
}
